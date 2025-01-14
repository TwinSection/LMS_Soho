import { useEffect, useState } from "react";
import { useUserContext } from "./context/UserContext";
import NavbarArea from "./Pages/NavbarArea";

import { Outlet, useNavigate } from 'react-router';
import { Pages } from "./App";
import FetchQuery from "./FetchQuery";
import { Container } from "react-bootstrap";

export default function UserHome() {

    let { user, setUser } = useUserContext();
    let nav = useNavigate();

    return <>
        <NavbarArea />
        <Container className=" content bg-white shadow" style={{ marginTop: '100px', border: '1px solid #ccc', borderRadius: '8px', padding: '3rem 2rem 4rem 2rem', }}>
            <Outlet />
        </Container>
    </>
}