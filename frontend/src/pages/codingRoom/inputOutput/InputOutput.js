import React from 'react';

const InputOutput = ({ input, output, setInput }) => {
    return (
        <div className="input-output-wrapper">
            <div className="input-box">
                <h3>Input</h3>
                <textarea
                    className="input-area"
                    placeholder="Provide input..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </div>
            <div className="output-box">
                <h3>Output</h3>
                <textarea
                    className="output-area"
                    placeholder="Results will appear here..."
                    readOnly
                    value={output}
                />
            </div>
        </div>
    );
};

export default InputOutput;
