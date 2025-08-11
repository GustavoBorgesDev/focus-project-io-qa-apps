import { useState, useContext } from 'react';
import { ProductContext } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'
import "./index.css";

const CSS = [
    "customShare",
    "customShareMainBtn",
    "customShareMainBtnActive",
    "customShareWrapper",
    "customShareWrapperActive",
    "customShareOverlay",
    "customShareFaceBtn",
    "customSharePintBtn",
    "customShareWhatBtn",
]

const PdpProductShare = () => {

    const handles = useCssHandles(CSS);
    const cls = handles.handles;

    const prodData: any = useContext(ProductContext);
    console.log(prodData);

    const [isActive, setActive]: any = useState(null);

    const openShare = (e) => {
        e.preventDefault();

        if (isActive == true) {
            setActive(null);
            return;
        }
        setActive(true);
    }

    return (
        <div className={cls.customShare}>
            <button
                onClick={openShare}
                className={`${cls.customShareMainBtn}  ${isActive ? cls.customShareMainBtnActive : ''}`}>
                <svg id="Grupo_2774" data-name="Grupo 2774" xmlns="http://www.w3.org/2000/svg" width="18" height="19.2" viewBox="0 0 18 19.2"><path id="Caminho_2621" data-name="Caminho 2621"
                    d="M30.625,12.45a3.372,3.372,0,0,0-2.714,1.371l-5.3-2.707A3.375,3.375,0,0,0,22.5,8.9l5.552-3.336a3.361,3.361,0,1,0-.577-.966L21.912,7.939a3.375,3.375,0,1,0,.207,4.186l5.282,2.7a3.375,3.375,0,1,0,3.224-2.374Zm0-11.325a2.25,2.25,0,1,1-2.25,2.25A2.253,2.253,0,0,1,30.625,1.125ZM19.375,12.413a2.25,2.25,0,1,1,2.25-2.25A2.253,2.253,0,0,1,19.375,12.413Zm11.25,5.663a2.25,2.25,0,1,1,2.25-2.25A2.253,2.253,0,0,1,30.625,18.075Z"
                    transform="translate(-16)"></path>
                </svg>
            </button>
            <div className={`${cls.customShareWrapper} ${isActive ? cls.customShareWrapperActive : ''}`}>
                <a
                    href={`https://www.facebook.com/sharer.php?u=https://www.focus.store/${prodData?.product.linkText}/p`}
                    target='_blank'
                    className={cls.customShareFaceBtn}
                >
                    <svg id="facebook"
                        xmlns="http://www.w3.org/2000/svg" width="8.002" height="16.002" viewBox="0 0 8.002 16.002">
                        <path id="facebook-2" data-name="facebook"
                            d="M12.728,2.657h1.461V.113A18.864,18.864,0,0,0,12.06,0C9.954,0,8.511,1.325,8.511,3.76V6H6.187V8.845H8.511V16h2.85V8.846h2.23L13.945,6H11.36V4.042c0-.822.222-1.385,1.367-1.385Z"
                            transform="translate(-6.187)" fill="#727272"></path>
                    </svg>
                </a>
                <a
                    href={`https://br.pinterest.com/pin/create/link/?url=/${prodData?.product.linkText}/p`}
                    target='_blank'
                    className={cls.customSharePintBtn}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13.001"
                        height="16.002" viewBox="0 0 13.001 16.002">
                        <path id="pinterest"
                            d="M8.968,0C4.582,0,2.25,2.811,2.25,5.875A4.293,4.293,0,0,0,4.316,9.631c.363.163.315-.036.627-1.229a.283.283,0,0,0-.068-.278C3.057,6.021,4.52,1.7,8.709,1.7c6.063,0,4.93,8.389,1.055,8.389A1.431,1.431,0,0,1,8.256,8.334,19,19,0,0,0,9.1,5.1c0-2.1-3.127-1.788-3.127.993a3.364,3.364,0,0,0,.3,1.44S5.271,11.6,5.084,12.361a10.786,10.786,0,0,0,.074,3.546.105.105,0,0,0,.192.049,12.574,12.574,0,0,0,1.656-3.119c.124-.457.633-2.31.633-2.31a2.764,2.764,0,0,0,2.332,1.112c3.064,0,5.279-2.694,5.279-6.036C15.24,2.4,12.5,0,8.968,0Z"
                            transform="translate(-2.25)" fill="#727272"></path>
                    </svg>
                </a>
                <a
                    href={`https://api.whatsapp.com/send?text=/${prodData?.product.linkText}/p`}
                    target='_blank'
                    className={cls.customShareWhatBtn}
                >
                    <svg id="whatsapp" xmlns="http://www.w3.org/2000/svg"
                        width="16.928" height="16.928" viewBox="0 0 16.928 16.928">
                        <path id="Caminho_2618" data-name="Caminho 2618"
                            d="M14.109,11.963l-.006.053c-1.551-.773-1.713-.876-1.914-.576-.139.208-.544.68-.666.82s-.246.148-.456.053a5.724,5.724,0,0,1-1.695-1.047A6.4,6.4,0,0,1,8.2,9.805C8,9.448,8.428,9.4,8.821,8.653a.388.388,0,0,0-.018-.37c-.053-.106-.474-1.143-.65-1.556s-.343-.36-.474-.36a1.05,1.05,0,0,0-.965.243c-1.138,1.251-.851,2.542.123,3.915,1.914,2.505,2.934,2.967,4.8,3.607a2.918,2.918,0,0,0,1.326.085,2.171,2.171,0,0,0,1.422-1.006,1.746,1.746,0,0,0,.127-1.005C14.459,12.111,14.321,12.058,14.109,11.963Z"
                            transform="translate(-1.761 -1.871)" fill="#727272"></path>
                        <path id="Caminho_2619" data-name="Caminho 2619"
                            d="M14.473,2.433A8.466,8.466,0,0,0,.071,8.388,8.348,8.348,0,0,0,1.2,12.582L0,16.928l4.468-1.165a8.443,8.443,0,0,0,12.46-7.37A8.319,8.319,0,0,0,14.463,2.46Zm1.045,5.937a7.022,7.022,0,0,1-10.588,6l-.254-.151L2.031,14.9l.709-2.571-.169-.264a7,7,0,0,1,10.9-8.63,6.9,6.9,0,0,1,2.052,4.93Z"
                            transform="translate(0 0)" fill="#727272"></path>
                    </svg>
                </a>
                <div className={cls.customShareOverlay}></div>
            </div>
        </div>
    )
}

export default PdpProductShare;