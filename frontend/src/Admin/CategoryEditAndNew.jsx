import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router";
import FetchQuery from "../FetchQuery";
import { AdminPages } from "../App";

export default function CategoryEditAndNew() {

    let nav = useNavigate();
    let params = useParams();
    let loc = useLocation();
    let IsNewCategoryPage = loc.pathname.endsWith("/new");

    let [category, setCategory] = useState({
        CategoryName : ""
    });

    useEffect(() => {
        if(!IsNewCategoryPage && params.id){
            FetchQuery.Admin.GetCategories(undefined, params.id).then((x) => {
                console.log(x);
                setCategory(x.data[0])
            });
        }
    }, []);

    function SaveCategory(e){
        e.preventDefault();
        let newData = {...category};

        if(IsNewCategoryPage) delete newData._id;

        (!IsNewCategoryPage ? FetchQuery.Admin.ModifyCategory : FetchQuery.Admin.CreateCategory)(undefined, newData).then((x) => {
            if(x.data || x.status == 1){
                setCategory(x.data);
                nav(AdminPages.Category);
            }else{
                alert(x.message);
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    function isFormFilled(){
        return category.CategoryName.length > 0;
    }

    return <>
        <div className="p-2">
            <Row className="mb-3">
                <Col>
                    <Form >
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Kategori Adı:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Title"
                                        placeholder="Kategori Adı Giriniz"
                                        value={category?.CategoryName}
                                        onChange={(e) => { isFormFilled(); setCategory({ ...category, CategoryName: e.target.value }) }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-grid gap-2">
                            <Button variant="outline-primary" type="submit" className="w-100"
                            onClick={SaveCategory} disabled={!isFormFilled()}>
                                Kaydet
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>

    </>
}