import React from 'react';

export default function Modal({ children, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="rounded margin" onClick={onClose}>-</button>
                {children}
            </div>
        </div>
    );
}