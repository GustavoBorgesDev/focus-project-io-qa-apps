import React, { useContext, useState, useEffect } from 'react'
// GraphGql
import getSku from "../../graphql/getSku.graphql"
// @ts-ignore
import { ProductContext } from 'vtex.product-context'
import { useApolloClient } from "react-apollo";
import { useCssHandles } from 'vtex.css-handles'
import "./index.css";

const CSS = [
    "pdpResumeItem",
    "pdpResumeText",
    "pdpResumeValue"
]

const PdpResumeSpecifications = () => {
    console.log("\n\nPdpResumeSpecifications\n\n");
    const handles = useCssHandles(CSS);
    const cls = handles.handles;

    const client = useApolloClient();

    const prodData: any = useContext(ProductContext);
    const skuId = prodData?.selectedItem.itemId;

    const [gramatura, setGramatura]: any = useState(null);
    const [largura, setLargura]: any = useState(null);
    const [composicao, setComposicao]: any = useState(null);

    const getSkuModal = async () => {
        try {
            let { data } = await querySku({
                value: skuId
            });
            console.log("Data SKU: ", data);
            setLargura(data.sku.packagedWidth);
        } catch (e) {
            console.log("Error: ", e.message);
        }
    }

    const querySku = async (item) => {
        return await client.query({
            query: getSku,
            variables: item
        });
    }

    const getFields = () => {
        let findGramatura = prodData?.product?.properties.find(item => {
            return item.name == "Gramatura"
        });
        if (findGramatura) {
            setGramatura(findGramatura.values[0]);
        }
        let findComposicao = prodData?.product?.properties.find(item => {
            return item.name == "Composição"
        });
        if (findComposicao) {
            setComposicao(findComposicao.values[0]);
        }
    }

    useEffect(() => {
        getFields();
        getSkuModal();
    }, [])

    return (
        <div>
            {gramatura && (
                <div className={cls.pdpResumeItem}>
                    <span className={cls.pdpResumeText}>Gramatura por m2:</span>
                    <span className={cls.pdpResumeValue}>{gramatura}</span>
                </div>
            )}
            {largura && (
                <div className={cls.pdpResumeItem}>
                    <span className={cls.pdpResumeText}>Largura útil:</span>
                    <span className={cls.pdpResumeValue}>{largura} CM</span>
                </div>
            )}
            {composicao && (
                <div className={cls.pdpResumeItem}>
                    <span className={cls.pdpResumeText}>Composição:</span>
                    <span className={cls.pdpResumeValue}>{composicao}</span>
                </div>
            )}
        </div>
    )
}

export default PdpResumeSpecifications;
