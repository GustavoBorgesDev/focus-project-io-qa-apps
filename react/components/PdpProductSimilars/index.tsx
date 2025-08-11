import React, { useContext, useState, useEffect } from 'react'
import { ProductContext } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'
import "./index.css";

const CSS = [
    "similarsTitle",
    "similarsWrapper",
    "simlarsItemLink",
    "simlarsItem",
    "simlarsItemImg"
]

const PdpProductSimilars = () => {

    const handles = useCssHandles(CSS);
    const cls = handles.handles;

    const prodData: any = useContext(ProductContext);

    const [products, setProducts]: any = useState(null);

    const fetchProducts = async () => {
        try {
            const productId = prodData?.product?.productId
            if (!productId) {
                throw new Error('Product ID is not available')
            }

            const response = await fetch(
                `/api/catalog_system/pub/products/crossselling/similars/${productId}`
            )
            if (!response.ok) {
                throw new Error(`Erro: ${response.status}`)
            }
            const result = await response.json()
            setProducts(result)
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);


    const RenderProducts = () => {
        if (!products) {
            return null;
        }

        return products?.map((item, index) => {
            let url = `/${item.linkText}/p`;
            return (
                <a 
                    href={url}
                    className={cls.simlarsItemLink}
                >
                    <div 
                        key={index}
                        className={cls.simlarsItem}
                    >
                        <img 
                            className={cls.simlarsItemImg}
                            src={item.items[0].images[0].imageUrl} />
                    </div>
                </a>
            )
        })
    }

    if (!products) {
        return null;
    }

    return (
        <div>
            <span className={cls.similarsTitle}>Cores Disponíveis</span>
            <div className={cls.similarsWrapper}>
                <RenderProducts />
            </div>
        </div>
    )
}

export default PdpProductSimilars;