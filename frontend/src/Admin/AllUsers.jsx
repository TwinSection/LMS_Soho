import { useEffect, useState } from "react";
import FetchQuery from "../FetchQuery";
import { Button, Col, Container, Modal, Row, Table } from "react-bootstrap";
import { AdminPages } from "../App";
import { useLocation, useNavigate, useParams } from "react-router";
import UserEditAndNew, { UserModal } from "./UserEditAndNew";

export default function AllUsers() {

    let [datas, setDatas] = useState([]);
    let nav = useNavigate();
    let params = useParams();
    let loc = useLocation();
    let IsNewUserPage = loc.pathname.endsWith("/new");
    let IsEditUserPage = params?.id ? true : false;

    let [showDeleteModal, setShowDeleteModal] = useState(false);
    let [deleteUser, setDeleteUser] = useState(undefined);

    function deleteModalHandle(){
        setDeleteUser(undefined);
        setShowDeleteModal(!showDeleteModal);
    }

    function DeleteThisUser(user){
        console.log(user._id);
        if(user._id){
            FetchQuery.Admin.DeleteUser(undefined, user._id).then((x) => {
                if(x.status == "success"){
                    FetchQuery.Admin.GetUsers().then((x) => {
                        if(x.data){
                            setDatas(x.data);
                        }
                    });
                }
            }).finally(() => {
                deleteModalHandle();
            })
        }
    }

    useEffect(() => {
        FetchQuery.Admin.GetUsers().then((x) => {
            console.log(x);
            if (x.data) {
                setDatas(x.data);
            }
        });
    }, [loc]);

    return <>

        {
            (IsEditUserPage || IsNewUserPage) && <>
                <UserModal
                    title={IsEditUserPage ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Ekle"}
                    show={IsEditUserPage || IsNewUserPage}
                    handleClose={() => {  nav(AdminPages.Users); }}
                    Content={UserEditAndNew}
                />
            </>
        }

        <Row className="my-4">
            <Col>
                <h1>Tüm Kullanıcılar</h1>
            </Col>
        </Row>

        <Row className="mb-3">
            <Col>
                <Button variant="primary" onClick={(e) => { e.preventDefault(); nav(AdminPages.Users + "/new") }} >Yeni Kullanıcı Ekle</Button>
            </Col>
        </Row>

        <Row>
            <Col>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Adı</th>
                            <th>Soyadı</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Aksiyon</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(Array.isArray(datas) ? datas : []).map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.Name}</td>
                                <td>{item.Surname}</td>
                                <td>{item.Email}</td>
                                <td>{item.Role}</td>
                                <td>
                                    <Button className="mx-1" size="sm" variant="primary" onClick={(e) => {
                                        e.preventDefault();
                                        let link = AdminPages.Users + "/" + item._id;
                                        nav(link);
                                    }}>Düzenle</Button>
                                    <Button className="mx-1" size="sm" variant="danger" onClick={(e) => {
                                        e.preventDefault();
                                        setDeleteUser(item);
                                        setShowDeleteModal(true);
                                    }}>Sil</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </Row>

        <Modal show={showDeleteModal} onHide={deleteModalHandle}>
            <Modal.Header closeButton>
                <Modal.Title>Kullanıcıyı Sil</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <p><b>{deleteUser?.Username}</b> ({deleteUser?.Email}) adlı kullanıcıyı silmek istiyor musunuz?</p>
                    <Button variant="danger" className="mx-1" onClick={(e) => { e.preventDefault(); DeleteThisUser(deleteUser); }}>Evet</Button>
                    <Button variant="primary" className="mx-1" onClick={(e) => { e.preventDefault(); deleteModalHandle(); }}>Hayır</Button>
                </Container>
            </Modal.Body>
        </Modal>

    </>
}