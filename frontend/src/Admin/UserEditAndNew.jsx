import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router";
import FetchQuery from "../FetchQuery";
import { AdminPages } from "../App";

export const UserModal = ({ title, Content, show, handleClose }) => {
    return <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Content />
            </Modal.Body>
        </Modal>
    </>
}

export default function UserEditAndNew() {

    let nav = useNavigate();
    let params = useParams();
    let loc = useLocation();
    let IsNewUserPage = loc.pathname.endsWith("/new");

    let [changePassword, setChangePassword] = useState(false);

    let [user, setUser] = useState({
        Username: "",
        Email: "",
        Name: "",
        Surname: "",
        Password: "",
        Role: "Kullanici"
    });

    const FormFields = [
        [
            { label: "Kullanıcı Adı", type: "text", name: "username", placeholder: "Kullanıcı adı giriniz", key: "Username" },
            { label: "Email", type: "email", name: "email", placeholder: "Email adresinizi giriniz", key: "Email" },
        ],
        [
            { label: "İsim", type: "text", name: "name", placeholder: "İsminizi giriniz", key: "Name" },
            { label: "Soyisim", type: "text", name: "surname", placeholder: "Soyisminizi giriniz", key: "Surname" },
        ]
    ]

    useEffect(() => {
        if (!IsNewUserPage && params.id) {
            FetchQuery.Admin.GetUsers(undefined, params.id).then((x) => {
                setUser(x.data[0]); // Array.isArray(x.data) = true
            });
        }
    }, []);

    useEffect(() => {
        if (user.Role != "Kullanici" && user.Role != "Egitmen" && user.Role != "Admin") {
            setUser({ ...user, Role: "Kullanici" });
        }
    }, [user.Role]);

    function SaveUser(e) {
        e.preventDefault();
        let newData = { ...user };
        if (!changePassword && !IsNewUserPage) {
            delete newData.Password;
        }

        if (IsNewUserPage) delete newData._id;

        (!IsNewUserPage ? FetchQuery.Admin.ModifyUser : FetchQuery.Admin.CreateUser)(undefined, newData).then((x) => {
            if (x.data) {
                setUser(x.data);
                nav(AdminPages.Users);
            } else {
                alert(x.message);
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    return <>
        <div className="p-2">
            <Row className="mb-3">
                <Col>
                    <Form >
                        {
                            FormFields.map((rowArea, index) => {
                                return <Row key={index}>
                                    {
                                        rowArea.map((field, fIndex) => {
                                            return <Col md={6} key={fIndex}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>{field.label}</Form.Label>
                                                    <Form.Control
                                                        type={field.type}
                                                        name={field.name}
                                                        placeholder={field.placeholder}
                                                        value={user[field.key]}
                                                        onChange={(e) => { setUser({ ...user, [field.key]: e.target.value }) }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        })
                                    }
                                </Row>
                            })
                        }
                        <Row>
                            {
                                !IsNewUserPage && (
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Switch
                                                label="Şifreyi Değiştir"
                                                value={changePassword}
                                                onChange={() => { setChangePassword(!changePassword) }}
                                            />
                                        </Form.Group>
                                    </Col>)
                            }

                            <Col md={!IsNewUserPage ? 6 : 12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Şifre</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Şifre giriniz"
                                        disabled={!changePassword && !IsNewUserPage}
                                        value={user.Password}
                                        onChange={(e) => { setUser({ ...user, Password: e.target.value }) }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>


                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    {
                                        user.Role == "Admin" ? (
                                            <Form.Label>Yetkili</Form.Label>
                                        ) : (
                                            <Form.Switch
                                                label={user.Role == "Kullanici" ? "Kullanıcı" : "Eğitmen"}
                                                value={user.Role != "Kullanici"}
                                                onChange={(e) => {
                                                    if (user.Role != "Kullanici")
                                                        setUser({ ...user, Role: "Kullanici" })
                                                    else
                                                        setUser({ ...user, Role: "Egitmen" })
                                                }}
                                            />
                                        )
                                    }

                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-grid gap-2">
                            <Button variant="outline-primary" type="submit" className="w-100"
                                onClick={SaveUser}
                            >
                                Kaydet
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>

    </>
}