import React, { useEffect } from 'react';

const Modal = ({ isOpen, body, alertModal = false, sourceOfFundStyle = '' }) => {
    const showHideClassName = isOpen ? 'react-modal display-block' : 'react-modal display-none';
    const alertModalClassName = alertModal ? 'alert-modal is-error' : '';

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

    }, [isOpen]);

    // When isOpen is false component should return nothing
    // Added because if modal is unmounted document.body.style.overflow is not changing to 'auto'
    // and scroll doesn't work
    if (!isOpen) {
        return null
    }
    return (
        <div className={`${showHideClassName} ${alertModalClassName}`}>
            <section className={`modal-main ${sourceOfFundStyle ? 'source-of-fund-modal' : ''}`}>
                {body}
            </section>
        </div>
    );
}

export default Modal;
