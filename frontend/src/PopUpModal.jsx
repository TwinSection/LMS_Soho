import { Modal } from "react-bootstrap";

export default function PopUpModal({ title, Content, show, handleClose, isXL = false, fullscreen = false}) {
    return <>
        <Modal show={show} onHide={handleClose} size={isXL ? "xl" : "lg"} fullscreen={fullscreen}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Content />
            </Modal.Body>
        </Modal>
    </>
}