import { Button, Col, Rate, Row } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/scss/image-gallery.scss'
import './ProductPage.scss'
import moment from 'moment'
import {
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import ModalGallery from './ModalGallery'
import { useSearchParams } from 'react-router-dom'
import { handleGetProductById } from '../../services/productService'

const images = [
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/',
  },
]

const ProductPage = () => {
  const [searchParams] = useSearchParams()
  const [product, setProduct] = useState([])
  const [imagesGallery, setImagesGallery] = useState([])
  const [isOpenGalleryModal, setIsOpenGalleryModal] = useState(false)
  const [currentImage, setCurrentImage] = useState()
  const [quantity, setQuantity] = useState(1)
  const refGallery = useRef()

  useEffect(() => {
    getProductInformation()
  }, [])

  const getProductInformation = async () => {
    const productId = searchParams.get('id')
    const response = await handleGetProductById(productId)
    if (response?.data) {
      const product = response.data
      setProduct(product)

      let images = [
        {
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            product.thumbnail
          }`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            product.thumbnail
          }`,
        },
      ]

      const slider = product.slider

      if (slider && slider.length > 0) {
        slider.map((image) => {
          let object = {}
          object.original = `${
            import.meta.env.VITE_BACKEND_URL
          }/images/book/${image}`
          object.thumbnail = `${
            import.meta.env.VITE_BACKEND_URL
          }/images/book/${image}`

          images.push(object)
        })
      }

      console.log(images)
      setImagesGallery(images)
    }
  }

  const onClickImage = () => {
    setIsOpenGalleryModal(!isOpenGalleryModal)
    setCurrentImage(refGallery.current.getCurrentIndex())
  }

  const date = moment(new Date()).format('MMMM DD')
  const dateDelivery = `${date} - ${new Date().getDate() + 10}`
  console.log(imagesGallery)
  return (
    <>
      <div className="product-page-background">
        <Row gutter={[15, 15]}>
          <Col
            className="product-detail-wrapper"
            xxl={15}
            xl={15}
            lg={18}
            md={22}
            sm={22}
            xs={23}
          >
            <div className="product-image-gallery">
              <ImageGallery
                className="gallery"
                ref={refGallery}
                items={imagesGallery}
                showNav={false}
                autoPlay={false}
                showPlayButton={false}
                slideOnThumbnailOver={true}
                onClick={onClickImage}
                showFullscreenButton={false}
              />
            </div>
            <div className="product-detail-infomation">
              <Col className="product-seller">
                Seller: <span>{product.author ? product.author : ''}</span>
              </Col>
              <Col className="product-title">
                {product.mainText ? product.mainText : ''}
              </Col>
              <Col className="product-rating">
                <Rate disabled value={5} />
                <span>Sold {product.sold ? product.sold : ''}</span>
              </Col>
              <Col className="product-price">
                ${product.price ? product.price : ''}
              </Col>
              <Col className="product-delivery">
                <span style={{ marginRight: 20, color: 'rgb(128, 128, 137)' }}>
                  Delivery
                </span>
                FREE delivery{' '}
                <span style={{ fontWeight: 'bold' }}>{dateDelivery}</span>
              </Col>
              <Col className="product-quantity">
                <span style={{ marginRight: 20, color: 'rgb(128, 128, 137)' }}>
                  Quantity
                </span>
                <span className="quantity-right">
                  <button
                    onClick={() => {
                      if (quantity === 0) return
                      setQuantity(quantity - 1)
                    }}
                  >
                    <MinusOutlined />
                  </button>
                  <input value={quantity} disabled min={0} />
                  <button onClick={() => setQuantity(quantity + 1)}>
                    <PlusOutlined />
                  </button>
                </span>
              </Col>

              <Col className="product-button">
                <Button type="primary">Buy Now</Button>
                <Button type="primary">
                  <ShoppingCartOutlined />
                  Add to Cart
                </Button>
              </Col>
            </div>
          </Col>
        </Row>

        <ModalGallery
          isOpenGalleryModal={isOpenGalleryModal}
          images={imagesGallery}
          closeModal={onClickImage}
          currentImage={currentImage}
          title={product.mainText}
        />
      </div>
    </>
  )
}

export default ProductPage
