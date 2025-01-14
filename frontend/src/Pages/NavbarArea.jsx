import { Form, Button, Container, Row, Col, Alert, Nav, Navbar } from 'react-bootstrap';
import {  useLocation, useNavigate } from 'react-router';
import { useUserContext } from '../context/UserContext';
import { NavbarUrls, Pages } from '../App';
import { useEffect } from 'react';

export default function NavbarArea() {

    let { user, setUser } = useUserContext();
    let nav = useNavigate();
    let loc = useLocation();

    return <>
        <Navbar style={{backgroundColor:"#ddd", color : "#000"}} expand="lg" fixed="top" className="shadow p-0">
            <Container>
                <Navbar.Brand href={Pages.Home} style={{color : '#000'}} onClick={(e) => {
                    e.preventDefault();
                    nav(Pages.Home);
                }}>LMS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {
                            NavbarUrls.map((item, index) => {
                                
                                if(item.url.length > 1){
                                    if(loc.pathname.startsWith(item.url)) item.active = true; else item.active = false;
                                }else if(loc.pathname == item.url) item.active = true; else item.active = false;
                                let style = {
                                    color : item.active ? "#23b3f5" : "#000",
                                    backgroundColor : item.active ? "#fff" : "transparent",
                                    fontWeight : item.active ? "bold" : "normal",
                                    textDecoration : item.active ? "underline" : "none",
                                    textUnderlineOffset: "0.275rem",
                                }
                                const itemClass = index === NavbarUrls.length - 1 ? "text-danger mx-2 py-3" : " mx-2 py-3";
                                return <Nav.Link key={index} className={itemClass} style={style} href={item.url} onClick={(e) => {
                                    e.preventDefault();
                                    if(item.f) item.f(setUser);
                                    nav(item.url);
                                }}>{item.name}</Nav.Link>
                            })
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
}