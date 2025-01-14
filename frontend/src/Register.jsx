import { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Pages } from './App';
import FetchQuery from './FetchQuery';

export default function Register() {
    let nav = useNavigate();
    let [showError, setShowError] = useState(undefined);
    let [showDialog, setShowDialog] = useState(undefined);
    
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [passwordAgain, setPasswordAgain] = useState("");
    let [email, setEmail] = useState("");
    let [name, setName] = useState("");
    let [surname, setSurname] = useState("");

    function RegisterButtonClick(e) {
        e.preventDefault();

        if(!checkIsAllInputsFull())
        {
            return setShowError("Form alanları doğru şekilde doldurulmamış.");
        }

        let _username = username.trim();
        let _password = password.trim();
        let _email = email.trim();
        let _name = name;
        let _surname = surname;

        FetchQuery.MakeRegister(_username, _password, _email, _name, _surname).then((res) => {
            console.log(res);
            if(res.status == "error")
            {
                setShowError("Kayıt başarısız. " + res.message);
                setShowDialog(undefined);
            }else{
                setShowDialog("Kayıt basarılı. " + res.message);
                setShowError(undefined);
            }
        }).catch((err) => {
            setShowError("Hata: Kayıt formu eksik veya hatalı doldurulmuş.");
            console.log(err);
        })
    }

    function checkIsInputBoxFull(val) {
        return val.trim().length >= 1;
    }

    function checkRegisterInputBox(val) {
        return (checkIsInputBoxFull(val)) && !val.includes(" ");
    }

    function checkEmailInputBox(val) {
        return checkRegisterInputBox(val) && val.includes("@") && val.includes(".");
    }
    
    function checkIsAllInputsFull(){
        return (IsPasswordsMatch() && checkIsInputBoxFull(name) && checkIsInputBoxFull(surname) && checkRegisterInputBox(password) && checkRegisterInputBox(passwordAgain) && checkRegisterInputBox(username) && checkEmailInputBox(email));
    }

    function IsPasswordsMatch()
    {
        if(password.trim().length>0 && passwordAgain.trim().length>0)
        {
            return (password.trim() == passwordAgain.trim());
        }else{

            return true;
        }
    }

    return <>
        <Container className="mt-5 mb-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div className="p-4 border rounded shadow-sm bg-white">
                        <h2 className="text-center mb-4">Kayıt Ol</h2>

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

                        <Form onSubmit={RegisterButtonClick}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Kullanıcı Adı</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            placeholder="Kullanıcı adı giriniz"
                                            value={username}
                                            onChange={(e)=>{
                                                setUsername(e.target.value);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="Email adresinizi giriniz"
                                            value={email}
                                            onChange={(e)=>{
                                                setEmail(e.target.value);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>İsim</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            placeholder="İsminizi giriniz"
                                            value={name}
                                            onChange={(e)=>{
                                                setName(e.target.value);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Soyisim</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="surname"
                                            placeholder="Soyisminizi giriniz"
                                            value={surname}
                                            onChange={(e)=>{
                                                setSurname(e.target.value);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Şifre</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Şifre giriniz"
                                            value={password}
                                            onChange={(e)=>{
                                                setPassword(e.target.value);
                                                if(IsPasswordsMatch())
                                                {                   
                                                    setShowError("Şifreler uyuşmuyor.");
                                                    setShowDialog(undefined);
                                                }else{
                                                    setShowError(undefined);
                                                    setShowDialog(undefined);
                                                }
                                            }}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Şifre Tekrar</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Şifrenizi tekrar giriniz"
                                            value={passwordAgain}
                                            onChange={(e)=>{
                                                setPasswordAgain(e.target.value);
                                                if(IsPasswordsMatch())
                                                {                   
                                                    setShowError("Şifreler uyuşmuyor.");
                                                    setShowDialog(undefined);
                                                }else{
                                                    setShowError(undefined);
                                                    setShowDialog(undefined);
                                                }
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            
                            <div className="d-grid gap-2">
                                <Button variant="outline-primary" type="submit" className="w-100" disabled={!checkIsAllInputsFull()}>
                                    Kayıt Ol
                                </Button>

                                <Button variant="outline-secondary" type="button" onClick={(e) => {
                                    e.preventDefault();
                                    nav(Pages.Login);
                                }} className="w-100">
                                    Girişe Dön
                                </Button>
                            </div>

                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    </>
}