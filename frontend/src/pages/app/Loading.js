import React from 'react';
import { motion } from 'framer-motion'; // Import framer-motion
import './Loading.css'; // Import the custom CSS

const loadingContainerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } }
};

const spinnerVariants = {
    initial: { rotate: 0 },
    animate: {
        rotate: 360,
        transition: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 1,
            ease: "linear"
        }
    }
};

const Loading = () => {
    return (
        <motion.div
            className="loading-container"
            variants={loadingContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <motion.div
                className="spinner"
                variants={spinnerVariants}
                initial="initial"
                animate="animate"
            ></motion.div>
            <motion.p
                className="loading-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
            >
                Loading...
            </motion.p>
        </motion.div>
    );
};

export default Loading;
