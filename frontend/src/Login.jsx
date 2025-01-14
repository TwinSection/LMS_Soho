import { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Pages } from './App';
import { useUserContext } from './context/UserContext';
import FetchQuery from './FetchQuery';

export default function Login() {
    let nav = useNavigate();
    let [showError, setShowError] = useState(undefined);
    let [showDialog, setShowDialog] = useState(undefined);

    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");

    let {user, setUser} = useUserContext();

    function LoginButtonClick(e) {
        e.preventDefault();

        if(!(checkLoginInputBox(username) && checkLoginInputBox(password)))
        {
            return setShowError("Kullanıcı bilgileri hatalı.");
        }

        let _username = username.trim();
        let _password = password.trim();

        FetchQuery.MakeLogin(_username, _password).then((res) => {
            console.log(res);
            if(!res.token)
            {
                return setShowError("Hata: " + res.message);
            }
            setShowDialog("Giriş başarılı. Yönlendiriliyorsunuz...");
            setUser({
                token : res.token
            });
            FetchQuery.Update({
                token : res.token
            });
        }).catch((err) => {
            setShowError("Hata: Kullanıcı bilgileri hatalı.");
            console.log(err);
        })
    }

    /**
     * 
     * @param {string} val 
     */
    function checkLoginInputBox(val) {
        return (val.trim().length >= 1);
    }
    
    return <Container className="mt-5">
        <Row className="justify-content-center">
            <Col md={6} lg={4}>
                <div className="p-4 border rounded shadow-sm bg-white">
                    <h2 className="text-center mb-4">Giriş Yap</h2>

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

                    <Form onSubmit={LoginButtonClick}>
                        <Form.Group className="mb-3">
                            <Form.Label>Kullanıcı Adı</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={username}
                                placeholder="Kullanıcı adınızı girin"
                                onChange={(e)=>{
                                    setUsername(e.target.value);
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Şifre</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={password}
                                placeholder="Şifrenizi girin"
                                onChange={(e)=>{
                                    setPassword(e.target.value);
                                }}
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button variant="outline-primary" type="submit" className="w-100" disabled={!(checkLoginInputBox(username) && checkLoginInputBox(password))}>
                                Giriş Yap
                            </Button>

                            <Button variant="outline-secondary" onClick={(e) => {
                                e.preventDefault();
                                nav(Pages.Register);
                            }} className="w-100">
                                Kayıt Ol
                            </Button>
                        </div>
                    </Form>
                </div>
            </Col>
        </Row>
    </Container>
}