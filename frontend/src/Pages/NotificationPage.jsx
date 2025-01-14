import { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Modal } from "react-bootstrap";
import FetchQuery from "../FetchQuery";
import { useUserContext } from "../context/UserContext";
import PopUpModal from "../PopUpModal";

export default function NotificationPage() {
    let [notifications, setNotifications] = useState([]);
    let {user, setUser} = useUserContext();

    let [showModal, setShowModal] = useState(false);
    let [selectedDescription, setSelectedDescription] = useState("");

    useEffect(() => {

        FetchQuery.GetNotify(user.token).then((x) => {
            if(x.data){
                console.log(x.data);
                setNotifications(x.data);
            }
        })

    }, []);

    const handleToggleStatus = (id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) => {
                if (notification.id === id) {
                    const newStatus = !notification.status;
                    console.log(`${id}. ${newStatus ? "okundu" : "okunmadı"}`);
                    return { ...notification, status: newStatus };
                }
                return notification;
            })
        );
    };

    const handleShowModal = (description) => {
        setSelectedDescription(description);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDescription("");
    };

    return (
        <Container>
            <Row className="mb-4">
                <Col>
                    <h1>Bildirim Listesi</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table responsive bordered hover>
                        <thead>
                            <tr>
                                <th>Başlık</th>
                                <th>Tarih</th>
                                <th>Detay</th>
                                <th>Durum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.map((notification) => (
                                <tr key={notification._id}>
                                    <td>{notification.Title}</td>
                                    <td>{notification.CreatedAt}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            onClick={() => handleShowModal(notification.Description) }
                                        >
                                            Görüntüle
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            variant={notification.status ? "success" : "secondary"}
                                            onClick={() => handleToggleStatus(notification.id)}
                                        >
                                            {notification.status ? "Okundu" : "Okunmadı"}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <PopUpModal show={showModal} handleClose={handleCloseModal} title="Bildirim Detayı" Content={() => { return <p>{selectedDescription ?? "Bildirim içeriği yok."}</p> }} />

        </Container>
    );
};