import React, { useState, useEffect } from 'react'
import { FaCode } from "react-icons/fa";
import axios from 'axios'
import { Icon, Col, Card, Row, Carousel } from 'antd'
import ImageSlider from '../../utils/ImageSlider'

const { Meta } = Card;


function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    useEffect(() => {
        const variables = {
            skip: Skip,
            limit: Limit
        }
        axios.post('/api/product/products', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data)
                    setProducts(response.data.productsInfo);
                } else {
                    alert('상품들을 가져오는데 실패했습니다.')
                }
            })
    }, [])

    const loadMoreHandler = () => {

    }

    const renderCards = Products.map((product, index) => {
        
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card
                cover={<ImageSlider images={product.images} />}
            >
                <Meta 
                    title={product.title}
                    description={product.price}
                />
            </Card>
        </Col>
    })

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>Let's Travel Anywhere <Icon type="rocket" /></h2>
            </div>
            {/* Filter */}
            {/* Search */}
            {/* Cards */}
            <Row gutter={[16, 16]}>
                {renderCards}
            </Row>
            
            <br/><br/>
            <div style={{ display: 'flex', justifyContent: 'center' }} >
                <button onClick={loadMoreHandler}>더보기</button>
            </div>
        </div>
    )
}

export default LandingPage
