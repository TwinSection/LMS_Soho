import { Container, Row, Col, Nav } from "react-bootstrap"
import { useLocation } from 'react-router';
import { useUserContext } from '../context/UserContext';
import { AdminNavbarUrls } from "../App";

export default function AdminSidebar(){

    let loc = useLocation();
    let { user, setUser } = useUserContext();

    return <Col md={2} style={{ backgroundColor: "#d9d9d9", padding: "1rem", boxSizing: "border-box" }}>
        <Nav className="flex-column p-0" style={{backgroundColor:"#ddd", color : "#000"}} expand="lg" fixed="top">
            <Nav.Item>
                <h2 className="text-center" style={{color : '#000', userSelect : "none"}} >Admin Page</h2>
            </Nav.Item>
            {
                AdminNavbarUrls.map((item, index) => {
                    return <Nav.Item key={index} className="mt-4">
                        <h5 style={{userSelect : "none"}}>{item.name}</h5>
                        {
                            item.Items.map((subitem) => {
                                if(subitem.url.length > 1){
                                    if(loc.pathname.startsWith(subitem.url)) subitem.active = true; else subitem.active = false;
                                }else if(loc.pathname == subitem.url) subitem.active = true; else subitem.active = false;
                                let style = {
                                    color : subitem.active ? "#23b3f5" : "#000",
                                    backgroundColor : subitem.active ? "#fff" : "transparent",
                                    fontWeight : subitem.active ? "bold" : "normal",
                                    textDecoration : subitem.active ? "underline" : "none",
                                    textUnderlineOffset: "0.275rem",
                                }
                                const subitemClass = index === AdminNavbarUrls.length - 1 ? "text-danger" : "";
                                return <Nav.Link style={style} className={subitemClass} href={subitem.url} key={subitem.name} onClick={(e) => {
                                    if(subitem.f) {
                                        e.preventDefault();
                                        subitem.f(setUser);
                                    }
                                }}>{subitem.name}</Nav.Link>
                            })
                        }
                    </Nav.Item>
                })
            }
        </Nav>
    </Col>
}