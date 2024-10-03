import React from 'react';

const ActionModal = ({ show, title, actionLabel, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>{title}</h3>
                <div className="modal-actions">
                    <button className="confirm-btn" onClick={onConfirm}>{actionLabel}</button>
                    <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ActionModal;
