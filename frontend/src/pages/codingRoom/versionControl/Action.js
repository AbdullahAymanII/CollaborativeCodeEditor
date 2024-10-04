import React, { useState } from 'react';

const Action = ({ show, title, actionLabel, inputs, onConfirm, onCancel }) => {
    const [inputValues, setInputValues] = useState({});

    const handleInputChange = (e, field) => {
        setInputValues({ ...inputValues, [field]: e.target.value });
    };

    const handleConfirm = () => {
        const filled = Object.values(inputValues).every(val => val.trim());
        if (filled) {
            onConfirm(inputValues);
            setInputValues({}); // Clear inputs after confirmation
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>{title}</h3>
                {inputs.map(({ label, placeholder, name }) => (
                    <div key={name}>
                        <label>{label}</label>
                        <input
                            type="text"
                            className="modal-input"
                            placeholder={placeholder}
                            value={inputValues[name] || ''}
                            onChange={(e) => handleInputChange(e, name)}
                        />
                    </div>
                ))}
                <div className="modal-actions">
                    <button className="confirm-btn" onClick={handleConfirm}>{actionLabel}</button>
                    <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default Action;
