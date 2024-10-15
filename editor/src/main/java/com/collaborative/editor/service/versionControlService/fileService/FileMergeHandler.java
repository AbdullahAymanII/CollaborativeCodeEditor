package com.collaborative.editor.service.versionControlService.fileService;


import com.collaborative.editor.model.file.File;
import org.springframework.stereotype.Component;

@Component
public class FileMergeHandler {

    private static final String CONFLICT_WARNING_MESSAGE = """
        /**
         * ======================================================
         * WARNING: MANUAL CONFLICT RESOLUTION REQUIRED
         * ======================================================
         * The programmer/user must resolve these conflicts manually, 
         * ensuring the code is correct. After resolving the conflicts, 
         * push the resolved version using the PUSH button in the interface.
         *
         * ======================================================
         */
        """;

    /**
     * Merges two versions of file content and returns the result with conflict markers if necessary.
     *
     * @param oldVersion The original version of the file.
     * @param newContent The new content to merge with the original.
     * @return The merged File object with conflicts, if any.
     */
    public File mergeFileContent(File oldVersion, String newContent) {
        String oldContent = oldVersion.getContent();
        String[] oldLines = splitLines(oldContent);
        String[] newLines = splitLines(newContent);

        String mergedContent = mergeLinesWithConflictMarkers(oldLines, newLines);
        oldVersion.setContent(mergedContent);

        return oldVersion;
    }

    /**
     * Splits the content into individual lines for processing.
     *
     * @param content The file content to split.
     * @return An array of lines.
     */
    private String[] splitLines(String content) {
        return content.split("\n");
    }

    /**
     * Merges the lines of two versions, adding conflict markers where there are differences.
     *
     * @param oldLines The lines of the old version.
     * @param newLines The lines of the new version.
     * @return The merged content with conflict markers.
     */
    private String mergeLinesWithConflictMarkers(String[] oldLines, String[] newLines) {
        StringBuilder mergedContent = new StringBuilder();
        mergedContent.append(CONFLICT_WARNING_MESSAGE).append("\n");

        int oldIndex = 0, newIndex = 0;
        while (oldIndex < oldLines.length && newIndex < newLines.length) {
            String oldLine = oldLines[oldIndex];
            String newLine = newLines[newIndex];

            if (oldLine.equals(newLine)) {
                mergedContent.append(oldLine).append("\n");
                oldIndex++;
                newIndex++;
            } else {
                appendConflict(mergedContent, oldLine, newLine);
                oldIndex++;
                newIndex++;
            }
        }

        appendRemainingLines(mergedContent, oldLines, oldIndex);
        appendRemainingLines(mergedContent, newLines, newIndex);

        return mergedContent.toString();
    }

    /**
     * Appends a conflict marker for differing lines.
     *
     * @param mergedContent The StringBuilder for merged content.
     * @param oldLine       The old version of the line.
     * @param newLine       The new version of the line.
     */
    private void appendConflict(StringBuilder mergedContent, String oldLine, String newLine) {
        mergedContent.append("<<<<<<< Current Version\n")
                .append(oldLine).append("\n")
                .append("=======\n")
                .append(newLine).append("\n")
                .append(">>>>>>> Incoming Version\n");
    }

    /**
     * Appends any remaining lines that were not compared (if one version is longer than the other).
     *
     * @param mergedContent The StringBuilder for merged content.
     * @param lines         The remaining lines to append.
     * @param index         The starting index from which to append.
     */
    private void appendRemainingLines(StringBuilder mergedContent, String[] lines, int index) {
        while (index < lines.length) {
            mergedContent.append(lines[index]).append("\n");
            index++;
        }
    }
}

