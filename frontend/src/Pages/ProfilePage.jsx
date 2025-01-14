import { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useUserContext } from '../context/UserContext';
import FetchQuery from '../FetchQuery';


export default function ProfilePage() {

    let { user, setUser } = useUserContext();
    let [userData, setUserData] = useState(undefined);
    let [updatePassword, setUpdatePassword] = useState(false);

    let [showError, setShowError] = useState(undefined);
    let [showDialog, setShowDialog] = useState(undefined);

    useEffect(() => {
        setUserData(user.user);
        console.log(user);
    }, [user]);

    function UpdateInfo(e) {
        e.preventDefault();

        let UpdateThisData = {
            NewName: userData.Name,
            NewSurname: userData.Surname
        }

        if (updatePassword) {
            UpdateThisData.NewPassword = userData.Password;
        }

        FetchQuery.UpdateUserInfo(user.token, UpdateThisData).then((res) => {
            console.log(res);
            if (res.status == "error") {
                return setShowError("İşlem basarısız. " + res.message);
            } else {
                setShowDialog(res.message);
                setUser({
                    ...user,
                    user: {
                        ...user.user,
                        Name: userData.Name,
                        Surname: userData.Surname
                    }
                });

                FetchQuery.Update({
                    ...user,
                    user: {
                        ...user.user,
                        Name: userData.Name,
                        Surname: userData.Surname
                    }
                })
                setShowError(undefined);
            }
        }).catch((err) => {
            console.log(err)
            setShowError(err?.response?.data?.message ?? "Hata: form eksik veya hatalı doldurulmuş.");
            console.log(err);
        })

    }

    return (
        userData && <>
            <Container className="content">
                <h2 className="mb-4">Profil Yönetimi</h2>

                {showDialog != undefined && (
                    <Alert variant="success" onClose={() => setShowDialog(undefined)} dismissible>
                        {showDialog}
                    </Alert>
                )}

                {showError != undefined && (
                    <Alert variant="danger" onClose={() => setShowError(undefined)} dismissible>
                        {showError}
                    </Alert>
                )}

                <Form>
                    <Form.Group as={Row} className="mb-3" controlId="formUsername">
                        <Form.Label column sm="3">Kullanıcı Adı</Form.Label>
                        <Col sm="9">
                            <Form.Label>{userData.Username}</Form.Label>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formEmail">
                        <Form.Label column sm="3">E-posta</Form.Label>
                        <Col sm="9">
                            <Form.Label>{userData.Email}</Form.Label>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formFirstName">
                        <Form.Label column sm="3">İsim</Form.Label>
                        <Col sm="9">
                            <Form.Control type="text" value={userData.Name} onChange={(e) => setUserData({ ...userData, Name: e.target.value })} placeholder="Enter your first name" />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formLastName">
                        <Form.Label column sm="3">Soyisim</Form.Label>
                        <Col sm="9">
                            <Form.Control type="text" value={userData.Surname} onChange={(e) => setUserData({ ...userData, Surname: e.target.value })} placeholder="Enter your last name" />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPassword">
                        <Form.Label column sm="3">Şifre</Form.Label>
                        <Col sm="2">
                            <Form.Check type="switch" defaultValue={updatePassword} onChange={(e) => setUpdatePassword(!updatePassword)} label="Update Password" />
                        </Col>
                        <>
                            {
                                updatePassword && 
                                <Col sm="7">
                                    <Form.Control type="password" value="PASSWORD" onChange={(e) => setUserData({ ...userData, Password: e.target.value })} placeholder="Enter your password" />
                                </Col>
                            }
                        </>
                    </Form.Group>

                    <Button variant="secondary" onClick={UpdateInfo} type="submit">
                        Değiştir ve Güncelle
                    </Button>
                </Form>
            </Container>
        </>
    );
};