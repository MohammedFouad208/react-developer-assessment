import React, { useState, useEffect } from "react"
import { Card,Button,Row,Col } from 'react-bootstrap';
import ReactPaginate from "react-paginate";
import { Multiselect } from 'multiselect-react-dropdown';



export function PostList() {
    const [Posts,setPosts] = useState([]);
    const [PostsFiltered,setPostsFiltered] = useState([]);
    const [categories,setCategories] = useState([]);

     // Pagination
    const [currentPage, setCurrentPage] = useState(0);

    const PER_PAGE = 9;
    const offset = currentPage * PER_PAGE;

    const pageCount = Math.ceil(PostsFiltered.length / PER_PAGE);

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };

    const GetPosts = () =>{
        fetch("/api/posts").then((response) => response.json())
        .then((json) => { setPosts(json.posts); setPostsFiltered(json.posts)});
    }

    const Getcategories = () =>{
        fetch("/api/Categories").then((response) => response.json())
        .then((json) =>  setCategories(json));
    }
    const FilterPosts = (SelectedCategories)=>{
        let FilteredPostsList = [];
        Posts.forEach(element => {
             for(var i=0;i<SelectedCategories.length;i++){
                var item = SelectedCategories[i];
                if(element.categories.find(obj=> obj.name == item.name) !=undefined){
                    FilteredPostsList.push(element);
                    break;
                 }
             }
        });
        setPostsFiltered(FilteredPostsList);
    }

    const onSelect = (e)=> {
        FilterPosts(e);
    }
    
    const onRemove = (e)=> {
        if(e.length > 0)
            FilterPosts(e);
        else
            setPostsFiltered(Posts);
    }
    useEffect(() => {
        GetPosts();
        Getcategories();
    }, []);

    return(
        <Row style={{ margin:0 , padding:10}}>
           <Col md='12'>
               <h2>Posts Today</h2>
           </Col>

           <Col md='12' style={{ marginBottom:20}}>
                <Multiselect
                    options={categories} // Options to display in the dropdown
                    onSelect={onSelect} // Function will trigger on select event
                    onRemove={onRemove} // Function will trigger on remove event
                    displayValue="name" // Property name to display in the dropdown options
                />
           </Col>
            {PostsFiltered.length > 0 && PostsFiltered.slice(offset, offset + PER_PAGE).map((obj,idx)=> (
                <Col md='4' key={idx}>
                    <Card style={{ width: '100%', marginBottom:"30px", minHeight:'400px' }}>
                        <Card.Img style={{ width:'50%' , height:'50%'}} src={obj.author.avatar} />
                        <Card.Body>
                        <Card.Title>{obj.title}</Card.Title>
                        <Card.Text>
                            <div>Author : {obj.author.name}</div>
                            <div>Published In : {new Date(obj.publishDate).toLocaleDateString()}</div>
                        </Card.Text>
                        <Button variant="primary">Details</Button>
                        </Card.Body>
                    </Card>
                </Col>
                
            ))}
            {PostsFiltered.length > 0 && (
                <Col xs={12}>
                    <ReactPaginate
                        previousLabel={"→ Previous"}
                        nextLabel={"Next ←"}
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        previousLinkClassName={"pagination__link"}
                        nextLinkClassName={"pagination__link"}
                        activeClassName={"pagination__link--active"}
                    />
                </Col>
            )}
        </Row>
    )
}