import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import axios from "axios";
import swal from 'sweetalert2'
import "./index.css";
import 'sweetalert2/dist/sweetalert2.min.css'
const CSS = [
    'registry_b2b_main',
    'registry_b2b_container',
    'registry_b2b_form_wrapper',
    'registry_b2b_form',
    'registry_b2b_title',
    'registry_b2b_cnpj',
    'registry_b2b_login',
    'registry_b2b_new_registry',
    'registry_b2b_popup_new_registry_overlay',
    'registry_b2b_popup_new_registry',
    'btn_close',
    'new_registry_field',
    'new_registry_title',
    'new_registry_cnpj',
    'new_registry_submit',
    'new_registry_loading_text',
    'new_registry_error',
    'new_registry_steps',
    'new_registry_steps_title',
    'new_registry_steps_container',
    'new_registry_form',
    'new_registry_complete_fields',
    'inline_checkbox_container',
    'use_tax_address',
    'submit_registry',
    'new_registry_divider',
    'registry_modal_title',
    'registry_modal_close'
]

const RegisterB2b = () => {
    const handles = useCssHandles(CSS)
    const cls = handles.handles;

    // Estados para o formulário de login
    const [cnpj, setCnpj] = useState('')

    // Estados para o popup de novo registro
    const [showNewRegistryPopup, setShowNewRegistryPopup] = useState(false)
    const [newCnpj, setNewCnpj] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [showLogin, setLogin] = useState(true);

    // Estados para o formulário de cadastro
    const [showRegistrationForm, setShowRegistrationForm] = useState(false)
    const [formData, setFormData] = useState({
        cnpj: '',
        razaoSocial: '',
        nomeFantasia: '',
        dataFundacao: '',
        inscricaoEstadual: '',
        isento: false,
        cepTax: '',
        addressTax: '',
        neighborhoodTax: '',
        numberTax: '',
        complementTax: '',
        countyTax: '',
        stateTax: '',
        name: '',
        lastName: '',
        email: '',
        emailConfirm: '',
        phone: '',
        cep: '',
        address: '',
        neighborhood: '',
        number: '',
        complement: '',
        city: '',
        state: '',
        recipient: '',
        addNewRecipient: false
    })

    const [visibleCorporateData, setVisibleCorporateData] = useState({
        cepTax: '',
        streetTax: '',
        neighborhoodTax: '',
        numberTax: '',
        complementTax: '',
        stateTax: '',
        cityTax: ''
    })

    // Estados para endereço fiscal
    const [useTaxAddress, setUseTaxAddress] = useState(false)

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Lógica para login com CNPJ
        console.log('Login com CNPJ:', cnpj)

        const MySwal = swal.mixin({
            customClass: {
                title: `${cls.registry_modal_title}`,
                confirmButton: `${cls.registry_modal_close}`,
            },
            buttonsStyling: false
        })

        MySwal.fire({
            title: "Aguarde...",
            didOpen: () => {
                MySwal.showLoading();
            }
        });


        let respCnpj = await verifyIfCnpjExists();

        if (respCnpj.data.found == true) {
            MySwal.hideLoading();
            MySwal.fire({
                icon: "success",
                title: "Opa! Você já tem cadastro, basta se logar.",
            });
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000)
            return;
        }


        MySwal.hideLoading();
        MySwal.fire({
            title: "Você não possui cadastro. Por favor, faça um cadastro.",
            allowOutsideClick: true,
            showCloseButton: true
        }).then(async (result) => {
            setShowNewRegistryPopup(true);
        });

    }

    const verifyIfCnpjExists = async () => {
        let config: any = {
            method: "GET",
            url: `/_v/md/get-client/${cnpj}`
        };
        let response = await axios(config);
        return response;
    }

    const getCNPJdata = async () => {
        let config: any = {
            method: "GET",
            url: `/_v/company/${cnpj}`
        };
        let response = await axios(config);
        return response;
    }

    const handleNewRegistrySubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        // Simular validação
        setTimeout(async () => {
            if (newCnpj.length < 14) {
                setError('CNPJ inválido')
                setIsLoading(false)
                return
            }

            let respCNPJ = await getCNPJdata();
            console.log("RESP CNPJ A: ", respCNPJ.data);
            populateCNPJdata(respCNPJ.data);

            setIsLoading(false)
            setLogin(false);
            setShowNewRegistryPopup(false)
            setShowRegistrationForm(true)
        }, 1000)
    }

    const populateCNPJdata = (data) => {
        console.log("Data 152 B: ", data);

        setFormData(prev => ({
            ...prev,
            cnpj: data.customer.document,
            razaoSocial: data.customer.corporateName,
            nomeFantasia: data.customer.tradeName,
            inscricaoEstadual: data.customer.stateRegistration,
            dataFundacao: formatDateToIso(data.customer.creationDate)
        }))

        setVisibleCorporateData({
            cepTax: data.address.postalCode,
            streetTax: data.address.street,
            neighborhoodTax: data.address.neighborhood,
            numberTax: data.address.number,
            complementTax: data.address.complement,
            stateTax: data.address.state,
            cityTax: data.address.city
        })

    }

    const saveCNPJdata = async (data) => {
        let config: any = {
            method: "POST",
            url: `/_v/company/${cnpj}`,
            data: data
        };
        let response = await axios(config);
        return response;
    }

    const handleRegistrationSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Dados do cadastro:', formData);

        const MySwal = swal.mixin({
            customClass: {
                title: `${cls.registry_modal_title}`,
                confirmButton: `${cls.registry_modal_close}`,
            },
            buttonsStyling: false
        })
        MySwal.fire({
            title: "Aguarde...",
            didOpen: () => {
                MySwal.showLoading();
            }
        });

        let bodyRequest = {
            email: formData.email,
            phone: formData.phone,
            homePhone: formData.phone,
            businessPhone: formData.phone,
            firstName: formData.name,
            lastName: formData.lastName
        }

        await saveCNPJdata(bodyRequest);


        MySwal.hideLoading();
        MySwal.fire({
            title: "Cadastro realizado com sucesso! Redirecionando para o login...",
            allowOutsideClick: true,
            showCloseButton: true
        }).then(async (result) => {
            window.location.href = '/login'
        });
    }

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleUseTaxAddress = () => {
        // setUseTaxAddress(!useTaxAddress)
        // if (!useTaxAddress) {
        // }
        console.log("clicadooo");
        setFormData(prev => ({
            ...prev,
            cep: visibleCorporateData.cepTax,
            address: visibleCorporateData.streetTax,
            neighborhood: visibleCorporateData.neighborhoodTax,
            number: visibleCorporateData.numberTax,
            complement: visibleCorporateData.complementTax,
            city: visibleCorporateData.cityTax,
            state: visibleCorporateData.stateTax
        }))
    }

    const handleUpdateRecipiet = () => {
        setFormData(prev => ({
            ...prev,
            recipient: `${formData.name} ${formData.lastName || ''}`
        }))
    };

    const formatDateToIso = (dateStr) => {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    }

    const estados = [
        { value: 'AC', label: 'Acre (AC)' },
        { value: 'AL', label: 'Alagoas (AL)' },
        { value: 'AP', label: 'Amapá (AP)' },
        { value: 'AM', label: 'Amazonas (AM)' },
        { value: 'BA', label: 'Bahia (BA)' },
        { value: 'CE', label: 'Ceará (CE)' },
        { value: 'DF', label: 'Distrito Federal (DF)' },
        { value: 'ES', label: 'Espírito Santo (ES)' },
        { value: 'GO', label: 'Goiás (GO)' },
        { value: 'MA', label: 'Maranhão (MA)' },
        { value: 'MT', label: 'Mato Grosso (MT)' },
        { value: 'MS', label: 'Mato Grosso do Sul (MS)' },
        { value: 'MG', label: 'Minas Gerais (MG)' },
        { value: 'PA', label: 'Pará (PA)' },
        { value: 'PB', label: 'Paraíba (PB)' },
        { value: 'PR', label: 'Paraná (PR)' },
        { value: 'PE', label: 'Pernambuco (PE)' },
        { value: 'PI', label: 'Piauí (PI)' },
        { value: 'RJ', label: 'Rio de Janeiro (RJ)' },
        { value: 'RN', label: 'Rio Grande do Norte (RN)' },
        { value: 'RS', label: 'Rio Grande do Sul (RS)' },
        { value: 'RO', label: 'Rondônia (RO)' },
        { value: 'RR', label: 'Roraima (RR)' },
        { value: 'SC', label: 'Santa Catarina (SC)' },
        { value: 'SP', label: 'São Paulo (SP)' },
        { value: 'SE', label: 'Sergipe (SE)' },
        { value: 'TO', label: 'Tocantins (TO)' }
    ]

    return (
        <>
            <div className={cls.registry_b2b_main}>

                {/* Formulário de Login */}
                {showLogin && (
                    <div className={cls.registry_b2b_form_wrapper}>

                        <form
                            id="registry_b2b"
                            className={cls.registry_b2b_form}
                            onSubmit={handleLoginSubmit}>
                            <p className={cls.registry_b2b_title}>Entrar com CNPJ</p>
                            <fieldset className={cls.registry_b2b_cnpj}>
                                <label htmlFor="cnpj">CNPJ*</label>
                                <input
                                    type="text"
                                    id="cnpj"
                                    placeholder="Digite"
                                    required
                                    value={cnpj}
                                    onChange={(e) => setCnpj(e.target.value)}
                                />
                            </fieldset>
                            <button type="submit" id="login_b2b" className={cls.registry_b2b_login}>
                                CONFIRMAR
                            </button>
                            <div className={cls.registry_b2b_new_registry}>
                                Ainda não tem uma conta?{' '}
                                <a href="#" onClick={() => setShowNewRegistryPopup(true)}>
                                    Faça o cadastro
                                </a>
                            </div>
                        </form>
                    </div>
                )}

                {/* Popup de Novo Registro */}
                {showNewRegistryPopup && (
                    <div className={cls.registry_b2b_popup_new_registry_overlay}>
                        <div className={cls.registry_b2b_popup_new_registry}>
                            <span className={cls.btn_close} onClick={() => {
                                setShowNewRegistryPopup(false)
                            }}>
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 26.75C21.0416 26.75 26.75 21.0416 26.75 14C26.75 6.95837 21.0416 1.25 14 1.25C6.95837 1.25 1.25 6.95837 1.25 14C1.25 21.0416 6.95837 26.75 14 26.75Z" stroke="#9F9F9F" strokeWidth="2" strokeMiterlimit="10" />
                                    <path d="M18.25 9.75L9.75 18.25" stroke="#9F9F9F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18.25 18.25L9.75 9.75" stroke="#9F9F9F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <div className={cls.new_registry_field} style={{ display: 'block' }}>
                                <p className={cls.new_registry_title}>Preencha seu CNPJ</p>
                                <form onSubmit={handleNewRegistrySubmit}>
                                    <input
                                        className={cls.new_registry_cnpj}
                                        type="text"
                                        id="new-cnpj"
                                        name="new-cnpj"
                                        placeholder="Digite o CNPJ"
                                        autoComplete="off"
                                        value={newCnpj}
                                        onChange={(e) => setNewCnpj(e.target.value)}
                                    />
                                    <input type="submit" value="continuar" className={cls.new_registry_submit} />
                                </form>
                                {isLoading && (
                                    <span className={cls.new_registry_loading_text}>Carregando...</span>
                                )}
                                {error && (
                                    <span className={cls.new_registry_error}>{error}</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Formulário de Cadastro */}
                {showRegistrationForm && (
                    <>
                        <p className={cls.new_registry_steps_title}>Cadastro</p>
                        <div className={cls.registry_b2b_container}>
                            <form
                                className={cls.new_registry_steps}
                                onSubmit={handleRegistrationSubmit}
                            >
                                <div className={cls.new_registry_steps_container}>

                                    {/* Dados Cadastrais */}
                                    <div className={cls.new_registry_form} id="cadastrais">
                                        <p>Dados Cadastrais</p>
                                        <hr className={cls.new_registry_divider} />
                                        <div className={cls.new_registry_complete_fields}>
                                            <fieldset>
                                                <label htmlFor="new_registry_cnpj">CNPJ*</label>
                                                <input
                                                    type="text"
                                                    id="new_registry_cnpj"
                                                    placeholder="Digite"
                                                    required
                                                    value={formData.cnpj}
                                                    onChange={(e) => handleInputChange('cnpj', e.target.value)}
                                                    disabled={true}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_razao_social">Razão Social*</label>
                                                <input
                                                    type="text"
                                                    id="new_registry_razao_social"
                                                    placeholder="Digite"
                                                    required
                                                    value={formData.razaoSocial}
                                                    onChange={(e) => handleInputChange('razaoSocial', e.target.value)}
                                                    disabled={true}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_nome_fantasia">Nome Fantasia</label>
                                                <input
                                                    type="text"
                                                    id="new_registry_nome_fantasia"
                                                    placeholder="Digite"
                                                    value={formData.nomeFantasia}
                                                    onChange={(e) => handleInputChange('nomeFantasia', e.target.value)}
                                                    disabled={true}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_data_fundacao">Data da fundação*</label>
                                                <input
                                                    type="date"
                                                    id="new_registry_data_fundacao"
                                                    placeholder="Digite"
                                                    required
                                                    value={formData.dataFundacao}
                                                    onChange={(e) => handleInputChange('dataFundacao', e.target.value)}
                                                    disabled={true}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_confirm_inscricao_estadual">Inscrição Estadual*</label>
                                                <div>
                                                    <input
                                                        type="text"
                                                        id="new_registry_confirm_inscricao_estadual"
                                                        placeholder="Digite"
                                                        required
                                                        value={formData.inscricaoEstadual}
                                                        onChange={(e) => handleInputChange('inscricaoEstadual', e.target.value)}
                                                        disabled={true}
                                                    />
                                                    <div className={cls.inline_checkbox_container}>
                                                        <input
                                                            type="checkbox"
                                                            id="new_registry_confirm_inscricao_estadual_isento"
                                                            checked={formData.isento}
                                                            onChange={(e) => handleInputChange('isento', e.target.checked)}
                                                            disabled={true}
                                                        />
                                                        <label htmlFor="new_registry_confirm_inscricao_estadual_isento">Sou isento</label>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>

                                    {/* Dados Fiscais */}
                                    <div className={cls.new_registry_form} id="fiscais">
                                        <p>Dados Fiscais</p>
                                        <hr className={cls.new_registry_divider} />
                                        <div className={cls.new_registry_complete_fields}>
                                            <fieldset>
                                                <label htmlFor="new_registry_cep_tax">CEP*</label>
                                                <input
                                                    type="text"
                                                    id="new_registry_cep_tax"
                                                    placeholder="Digite"
                                                    required
                                                    value={visibleCorporateData.cepTax}
                                                    onChange={(e) => handleInputChange('cepTax', e.target.value)}
                                                    disabled={true}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_address_tax">Endereço*</label>
                                                <input
                                                    type="text"
                                                    id="new_registry_address_tax"
                                                    placeholder="Digite"
                                                    required
                                                    value={visibleCorporateData.streetTax}
                                                    onChange={(e) => handleInputChange('streetTax', e.target.value)}
                                                    disabled={true}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_neighborhood_tax">Bairro*</label>
                                                <input
                                                    type="text"
                                                    id="new_registry_neighborhood_tax"
                                                    placeholder="Digite"
                                                    required
                                                    value={visibleCorporateData.neighborhoodTax}
                                                    onChange={(e) => handleInputChange('neighborhoodTax', e.target.value)}
                                                    disabled={true}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_number_tax">Número*</label>
                                                <input
                                                    type="number"
                                                    id="new_registry_number_tax"
                                                    placeholder="Ex: S / N"
                                                    required
                                                    value={visibleCorporateData.numberTax}
                                                    onChange={(e) => handleInputChange('numberTax', e.target.value)}
                                                    disabled={true}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_complement_tax">Complemento</label>
                                                <input
                                                    type="text"
                                                    id="new_registry_complement_tax"
                                                    placeholder="Ex: Ap 133 - Bloco C"
                                                    value={visibleCorporateData.complementTax}
                                                    onChange={(e) => handleInputChange('complementTax', e.target.value)}
                                                    disabled={true}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_county_tax">Município*</label>
                                                <input
                                                    type="text"
                                                    id="new_registry_county_tax"
                                                    placeholder="Digite"
                                                    required
                                                    value={visibleCorporateData.cityTax}
                                                    onChange={(e) => handleInputChange('cityTax', e.target.value)}
                                                    disabled={true}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_state_tax">Estado*</label>
                                                <select
                                                    id="new_registry_state_tax"
                                                    required
                                                    value={visibleCorporateData.stateTax}
                                                    onChange={(e) => handleInputChange('stateTax', e.target.value)}
                                                    disabled={true}
                                                >
                                                    <option value="">Selecione</option>
                                                    {estados.map(estado => (
                                                        <option key={estado.value} value={estado.value}>
                                                            {estado.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </fieldset>
                                        </div>
                                    </div>

                                    <hr className={cls.new_registry_divider} />

                                    {/* Dados de Contato */}
                                    <div className={cls.new_registry_form} id="contato">
                                        <p>Dados de Contato</p>
                                        <hr className={cls.new_registry_divider} />
                                        <div className={cls.new_registry_complete_fields}>
                                            <fieldset>
                                                <label htmlFor="new_registry_name">Nome*</label>
                                                <input
                                                    type="text"
                                                    id="new_registry_name"
                                                    placeholder="Digite"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    onBlur={handleUpdateRecipiet}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_last_name">Sobrenome*</label>
                                                <input
                                                    type="text"
                                                    id="new_registry_last_name"
                                                    placeholder="Digite"
                                                    required
                                                    value={formData.lastName}
                                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                    onBlur={handleUpdateRecipiet}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_email">E-mail de contato*</label>
                                                <input
                                                    type="email"
                                                    id="new_registry_email"
                                                    placeholder="Digite"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_email_confirm">Confirmar email*</label>
                                                <input
                                                    type="email"
                                                    id="new_registry_email_confirm"
                                                    placeholder="Digite"
                                                    required
                                                    value={formData.emailConfirm}
                                                    onChange={(e) => handleInputChange('emailConfirm', e.target.value)}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_phone">Telefone*</label>
                                                <input
                                                    type="tel"
                                                    id="new_registry_phone"
                                                    placeholder="Digite"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                />
                                            </fieldset>
                                        </div>
                                    </div>

                                    <hr className={cls.new_registry_divider} />

                                    {/* Endereço de Entrega */}
                                    <div className={cls.new_registry_form} id="entrega">
                                        <p>Endereço de Entrega</p>
                                        <button
                                            className={cls.use_tax_address}
                                            type="button"
                                            onClick={handleUseTaxAddress}
                                        >
                                            {useTaxAddress ? 'Usar endereço personalizado' : 'Usar endereço fiscal'}
                                        </button>
                                        <hr className={cls.new_registry_divider} />
                                        <div className={cls.new_registry_complete_fields}>
                                            <fieldset>
                                                <label htmlFor="new_registry_cep">CEP*</label>
                                                <input
                                                    type="text"
                                                    id="new_registry_cep"
                                                    placeholder="Digite"
                                                    required
                                                    maxLength={10}
                                                    value={formData.cep}
                                                    onChange={(e) => handleInputChange('cep', e.target.value)}
                                                    disabled={useTaxAddress}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_address">Endereço*</label>
                                                <input
                                                    type="text"
                                                    id="new_registry_address"
                                                    placeholder="Digite"
                                                    required
                                                    value={formData.address}
                                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                                    disabled={useTaxAddress}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_neighborhood">Bairro*</label>
                                                <input
                                                    type="text"
                                                    id="new_registry_neighborhood"
                                                    placeholder="Digite"
                                                    required
                                                    value={formData.neighborhood}
                                                    onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                                                    disabled={useTaxAddress}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_number">Número*</label>
                                                <input
                                                    type="number"
                                                    id="new_registry_number"
                                                    placeholder="Ex: S / N"
                                                    required
                                                    value={formData.number}
                                                    onChange={(e) => handleInputChange('number', e.target.value)}
                                                    disabled={useTaxAddress}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_complement">Complemento</label>
                                                <input
                                                    type="text"
                                                    id="new_registry_complement"
                                                    placeholder="Ex: Ap 133 - Bloco C"
                                                    value={formData.complement}
                                                    onChange={(e) => handleInputChange('complement', e.target.value)}
                                                    disabled={useTaxAddress}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_county">Município*</label>
                                                <input
                                                    type="text"
                                                    id="new_registry_county"
                                                    placeholder="Digite"
                                                    required
                                                    value={formData.city}
                                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                                    disabled={useTaxAddress}
                                                />
                                            </fieldset>
                                            <fieldset>
                                                <label htmlFor="new_registry_state">Estado*</label>
                                                <select
                                                    id="new_registry_state"
                                                    value={formData.state}
                                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                                    disabled={useTaxAddress}
                                                >
                                                    {estados.map(estado => (
                                                        <option key={estado.value} value={estado.value}>
                                                            {estado.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </fieldset>
                                            <fieldset>
                                                <div>
                                                    <label htmlFor="new_registry_recipient">Destinatário*</label>
                                                    <input
                                                        type="text"
                                                        id="new_registry_recipient"
                                                        placeholder="Digite"
                                                        required
                                                        value={formData.recipient}
                                                        onChange={(e) => handleInputChange('recipient', e.target.value)}
                                                        disabled={!formData.addNewRecipient}
                                                    />
                                                    <div className={cls.inline_checkbox_container}>
                                                        <input
                                                            type="checkbox"
                                                            id="new_registry_recipient_checkbox"
                                                            checked={formData.addNewRecipient}
                                                            onChange={(e) => handleInputChange('addNewRecipient', e.target.checked)}
                                                        />
                                                        <label htmlFor="new_registry_recipient_checkbox">Adicionar novo destinatário</label>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                                <hr className={cls.new_registry_divider} />
                                <button type="submit" className={cls.submit_registry}>
                                    Enviar
                                </button>
                            </form>

                        </div>
                    </>
                )}

            </div>
        </>
    )
}

export default RegisterB2b