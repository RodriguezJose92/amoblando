class MudiPixel {

    /** Builder OBJECT*/
    constructor() {

        /** General Info  */
        this.testType = null;
        this.userID = null;                 //✔️ 
        this.path = null;                   //✔️
        this.device = null;                 //✔️
        this.detailDevice = null;           //✔️
        this.date = null;                   //✔️
        this.timeInSession = null;          //✔️
        this.skuNumber = null;              //✔️
        this.idCompany = 147;               //🟠

        /** Events interaction buttons  */
        this.viewerEvent = 0;               //✔️
        this.interaction3D = 0;             //✔️
        this.interactionAR = 0;             //✔️

        this.addToCar = 0;                  //✔️
        this.purchaseClick = 0;             //✔️

        /** Element DOM Verify and SEND */
        this.category = null;               //✔️✔️
        this.subCategory = null;            //✔️✔️

        /** VerifyDoms -- Counters */
        this.verifyAddToCarButton = 0;      //✔️
        this.verifyBreadcrumb = 0;          //✔️
        this.verifyPurchaseButton = 0;      //✔️
        this.verifyContainerMudiBtns = 0;   //✔️
        this.btnARVerify = 0;               //✔️
        this.verifySkuNumber = 0;           //✔️

        /** IndexDataBase */
        this.DBMudiProducts = null;

    };

    /** Build Test AB */
    async verifyTestingAB() {

        /** verify Test */
        let testMudi = localStorage.getItem('UserMudiTest');

        if (testMudi !== null) { this.testType = testMudi }
        else {
            /** Petition Server */
            const newBody = { "idCompany": this.idCompany };
            const request = await fetch(`https://viewer.mudi.com.co:3589/api/mudiv1/getInfoTest`, {
                method: 'POST',
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(newBody)
            });

            const response = await request.json();
            await this.updateTesting(response.data[0].test)
        };

    };

    async updateTesting(lastTest) {

        /** Updatte testing */
        let testUpdate;
        lastTest == 'A' ? (testUpdate = 'B') : (testUpdate = 'A');

        const newBody = { "idCompany": this.idCompany, "typeTest": testUpdate };
        const request = await fetch(`https://viewer.mudi.com.co:3589/api/mudiv1/updateInfoTest`, {
            method: 'POST',
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(newBody)
        })

        this.testType = testUpdate;
        localStorage.setItem('UserMudiTest', testUpdate)
    };

    /** Events for DOM verification */

    /** 1. Verify addToCar ✔️ */
    verifyAddToCar() {

        /** Declared DOM Element */
        let
            element = document.body.querySelector(`.cart-add`); // CUSTOM ELEMENT ✔️

        /** End process verify  */
        if (this.verifyAddToCarButton > 5000) { console.log("%cMudiPixel:\n", "color:#820ad1; font-weight:600", "The button to add to cart was not found ❌"); return false; };

        /** Add Evento addToCar || Resend  */
        element
            ? (element.parentNode.addEventListener('click', () => this.addToCar++),
                console.log("%cMudi Pixel: \n", "color:#820ad1; font-weight:600", "Add To car Correctly setting 🚀"))
            : (requestAnimationFrame(this.verifyAddToCar.bind(this)), this.verifyAddToCarButton++);

    };

    /** 2. Verify Categories ✔️ */
    verifyCategory() {

        /** Declared DOM BreadCrumb*/
        let
            breadcrumb = document.body.querySelector(`.breadcrumb`); // CUSTOM ELEMENT breadcrumb

        /** End process verify  */
        if (this.verifyBreadcrumb > 5000) { console.log("%cMudiPixel:\n", "color:#820ad1; font-weight:600", "Breadcrumb was not found ❌"); return false };
        /** Add Evento addToCar || Resend  */
        breadcrumb
            ? (this.category = breadcrumb.children[1].innerText,
                this.subCategory = breadcrumb.children[2].innerText,
                console.log("%cMudi Pixel: \n", "color:#820ad1; font-weight:600", "Category Correctly setting 🚀"))
            : (requestAnimationFrame(this.verifyCategory.bind(this)), this.verifyBreadcrumb++);
    };

    /** 3. VerifyBuyButton -- Purchase Completion ✔️ */
    verifyPurchase() {

        /** Declared btn Purchase*/
        let purchaseBtn = document.body.querySelector(`.send-event-purchase`); // CUSTOM ELEMENT breadcrumb

        /** Verify purcahseBtn*/
        if (this.verifyPurchaseButton > 5000) { console.log("%cMudiPixel:\n", "color:#820ad1; font-weight:600", "Purchase was not found ❌"); return false };

        /** Add Event Purchase || Resend  */
        purchaseBtn
            ? (purchaseBtn.addEventListener('click', () => this.purchaseClick++),
                this.verifyproductInteractive3D(),
                console.log("%cMudi Pixel: \n", "color:#820ad1; font-weight:600", "Purchase Correctly setting 🚀"))
            : (requestAnimationFrame(this.verifyPurchase.bind(this)), this.verifyPurchaseButton++);
    };

    /** 3.1 Verify interaction with products 3D Experience ❌*/
    verifyproductInteractive3D() {

        const allProductsSkus = document.body.querySelectorAll('.media-content-details')

        for (let i = 0; i < allProductsSkus.length; i++) {

            /** Get SKU NUMBER Cars product to Pay */
            let productSKU = allProductsSkus[i].querySelector('.col-xs-10').innerHTML;

            /** Open indexDB */
            const db = this.DBMudiProducts.result;
            const sku = db.transaction('products', 'readonly');
            const objectStore = sku.objectStore('products');
            const
                cursor = objectStore.openCursor();
            let array = [];

            cursor.addEventListener("success", () => {
                if (cursor.result) {
                    productSKU == cursor.result.value.sku && array.push(productSKU)
                    cursor.result.continue();
                } else console.log('consulta realizada');
            });

            this.skuNumber = array;
        };
    };


    /** 4. Verify container Btns Mudi PDP ✔️ */
    verifyContainerBtnsMudi() {

        /** Declared DOM Container Btns*/
        let
            containerBtnsMudi = document.body.querySelector(`.btnsMudiContainer`); // CUSTOM ELEMENT Container Btns

        /** End process verify  */
        if (this.verifyContainerMudiBtns > 1500) { console.log("%cMudiPixel:\n", "color:#820ad1; font-weight:600", "Container Btns Mudi was not found ❌"); return false };

        /** Add Evento addToCar || Resend  */
        containerBtnsMudi
            ? (
                this.viewerEvent++,
                document.body.querySelector('.btnMudi3D').addEventListener('click', () => {

                    this.createDB();
                    this.readObjectDB();
                    this.createRegistryDB();

                    this.interaction3D++;
                    this.verifyBtnAR();
                }),
                console.log("%cMudi Pixel: \n", "color:#820ad1; font-weight:600", "Container Btns Mudi Correctly setting 🚀"))
            : (requestAnimationFrame(this.verifyContainerBtnsMudi.bind(this)), this.verifyContainerMudiBtns++);

    };

    /** 5. Verify btnAR Mudi PDP ❌ */
    verifyBtnAR() {

        /** Declared DOM Container Btns*/
        let
            btnAR = document.body.querySelector(`.imgBtnAR`), // CUSTOM ELEMENT btn AR
            flagControl = false;

        /** End process verify  */
        if (this.btnARVerify > 1500) { console.log("%cMudiPixel:\n", "color:#820ad1; font-weight:600", "Btn Ar mode was not found ❌"); return false };

        /** Add Evento addToCar || Resend  */
        btnAR
            ? (
                btnAR.addEventListener('click', () => !flagControl ? (flagControl = !flagControl, this.interactionAR++) : (flagControl = !flagControl)),
                console.log("%cMudi Pixel: \n", "color:#820ad1; font-weight:600", "Btn AR mode Correctly setting 🚀"))
            : (requestAnimationFrame(this.verifyBtnAR.bind(this)), this.btnARVerify++);

    };

    /** 6. Verify SKUNumber ✔️*/
    verifySku() {

        /** Declared DOM Container Btns*/
        let
            skuContainer = document.body.querySelector(`.btnsMudiContainer`)// CUSTOM ELEMENT TEXT SKU

        /** End process verify  */
        if (this.btnARVerify > 1500) { console.log("%cMudiPixel:\n", "color:#820ad1; font-weight:600", "SkuNumber was not found ❌"); return false };

        /** Add Evento addToCar || Resend  */
        skuContainer
            ? (
                this.skuNumber = skuContainer.getAttribute('skunumber'),
                console.log("%cMudi Pixel: \n", "color:#820ad1; font-weight:600", "SkuNumber Correctly setting 🚀"))
            : (requestAnimationFrame(this.verifySku.bind(this)), this.verifySkuNumber++);

    };


    /** 7. Create Registry and DBIndexed Mudi ❌ */
    createDB() {

        this.DBMudiProducts.addEventListener('upgradeneeded', () => {
            let resultRequest = DBMudiProducts.result;
            resultRequest.createObjectStore('products', { autoIncrement: true });
        });

        this.DBMudiProducts.addEventListener('success', () => {
            console.log('Todo salió bien')
        });

        this.DBMudiProducts.addEventListener('error', () => {
            throw new Error('No pudimos abrir ni crear la base de datos del pixel de Mudi')
        });

    };

    /** 7.1 Create registyDB */
    createRegistryDB() {
        const db = this.DBMudiProducts.result;
        const sku = db.transaction('products', 'readwrite');
        const objectStore = sku.objectStore('products');
        objectStore.add({ "sku": this.skuNumber, "fechaCreacion": this.date });
    };

    /** 7.2 DeleteRegistry because date */
    deleteRegistryDB(key) {
        const db = this.DBMudiProducts.result;
        const sku = db.transaction('products', 'readwrite');
        const objectStore = sku.objectStore('products');
        objectStore.delete(key);
    };

    /** 7.3 Read Info productsMudi */
    readObjectDB() {

        const verifydate = (dateMudi, key) => {
            const _getYear = new Date().getFullYear()
            const _getMonth = new Date().getMonth() + 1;
            const _getday = new Date().getDate();
            const DateMudi = dateMudi.split(' ')[0].split('-');

            if (_getYear > DateMudi[0] || _getMonth > DateMudi[1] || _getday > DateMudi[2]) {
                this.deleteRegistryDB(key)
            };
        };

        const db = this.DBMudiProducts.result;
        const sku = db.transaction('products', 'readonly');
        const objectStore = sku.objectStore('products');
        const
            cursor = objectStore.openCursor();

        cursor.addEventListener("success", () => {

            if (cursor.result) {
                verifydate(cursor.result.value.fechaCreacion, cursor.result.key);
                cursor.result.continue();
            } else {
                console.log('consulta realizada')
            };

        })

    };


    /** Events info General */

    /* 1. identyUser */
    async identifyUserMudi() {

        /* Mudi user storage*/
        let userMudi = localStorage.getItem('userMudi');

        /* Petition Server */
        const petitionServerMudi = async () => {

            try {
                const
                    request = await fetch('https://viewer.mudi.com.co:3589/api/mudiv1/userAnalitycs');

                const
                    response = await request.json();

                localStorage.setItem('userMudi', response.data.insertId)
                this.userID = response.data.insertId;

            } catch (error) {
                throw new Error(error)
            };

        };

        /* Verification user */
        userMudi ? this.userID = userMudi : petitionServerMudi();

    };

    /* 2. Get Path */
    getPath() { this.path = location.href };

    /* 3 & 4. Recognized device */
    recognizeDevice() {

        //** Define Structure Response */
        let response = {
            Device: null,
            type: `Mobile`
        };

        const
            userAgent = navigator.userAgent,
            listUA = userAgent.split(" ");

        /** Better use REGEX ❌ Add TO DO */

        /** OS Android  */
        if (userAgent.toLowerCase().includes('android')) {
            let androidVersion = listUA[2] + ' ' + listUA[3];
            let androidModel = listUA[4] + ' ' + listUA[5];
            response.Device = `Android ${androidModel} V-${androidVersion}`;
        }

        /** IOS */
        else if (userAgent.toLowerCase().includes('iphone'))
            response.Device = `iPhone OS ${listUA[5].split('_').join('.')}`;
        else if (userAgent.toLowerCase().includes('ipad'))
            response.Device = `iPad OS ${listUA[5].split('_').join('.')}`;
        else if (userAgent.toLowerCase().includes('Macintosh'))
            response.Device = `Macintosh OS ${listUA[6].split('_').join('.')}`;

        /** Window */
        else if (listUA[1].toLowerCase().includes('windows')) {
            response.Device = `Windows V- ${listUA[3].replace(";", " ")} ${listUA[4].replace(";", " ")}`;
            response.type = `Desk`
        }

        /** Linux */
        else if (userAgent.toLowerCase().includes('linux') && !userAgent.toLowerCase().includes('android')) {
            response.Device = `Linux`;
            response.type = `Desk`;
        }

        /** Unknowled */
        else {
            response.Device = "Desconocido"
            response.type = null;
        };

        this.device = response.type;
        this.detailDevice = response.Device;
    };

    /* 5 Get Date -- FORMAT DATETIME AAAA-MM-DD HH:MM:SS  */
    getDate() {

        /** Build Date */
        const dateActual = new Date();

        /** Build information */
        let dateInfo = {
            month: dateActual.getMonth() + 1,
            day: dateActual.getDate(),
            year: dateActual.getFullYear(),
            hour: dateActual.getHours(),
            minute: dateActual.getMinutes(),
            seconds: dateActual.getSeconds()
        };

        /** Build Date Sesion  dd -- mm -- aa -- ||  hh -- mm -- ss */
        this.date = `${dateInfo.year}-${dateInfo.month < 10 ? '0' + dateInfo.month : dateInfo.month}-${dateInfo.day} ${dateInfo.hour < 10 ? '0' + dateInfo.hour : dateInfo.hour}:${dateInfo.minute}:${dateInfo.seconds}`;
    };

    /* 6 time In Session */
    timeSesion() {

        /** Configaration Time */
        let time = {
            hour: 0,
            minutes: 0,
            seconds: 0
        };

        setInterval(() => {

            /**up one Sec */
            time.seconds++;

            /** verify Secs */
            if (time.seconds < 10) {
                time.seconds = `0${time.seconds}`
                time.minutes == 0 && (time.minutes = '00')
                time.hour == 0 && (time.hour = '00')
            }

            /** VerifyMinutes */
            if (time.seconds == 60) {
                time.seconds = '00';
                time.minutes++;
                time.minutes < 10 ? time.minutes = `0${time.minutes}` : time.minutes = `${time.minutes}`;
            }

            /** Verify hours */
            if (time.minutes == 60) {
                time.minutes = '00';
                time.hour++;
                time.hour < 10 ? time.hour = `0${time.hour}` : time.hour = `${time.hour}`;
            }

            this.timeInSession = `${time.hour}:${time.minutes}:${time.seconds}`;

        }, 1000);
    };

    /* Event beforeUnload */
    addEventBeforeUnload() {

        window.addEventListener('beforeunload', e => {

            let bodyToSend = {
                userID: this.userID,
                path: this.path,
                device: this.device,
                detailDevice: this.detailDevice,
                dateMudi: this.date,
                timeInSession: this.timeInSession,
                viewEvent: this.viewerEvent,
                interaction3D: this.interaction3D,
                interactionAR: this.interactionAR,
                addToCar: this.addToCar,
                purchaseClick: this.purchaseClick,
                category: this.category,
                subCategory: this.subCategory,
                skuNumber: this.skuNumber,
                idCompany: this.idCompany,
                testType: this.testType
            };

            const request = fetch('https://viewer.mudi.com.co:3589/api/mudiv1/registryPixelMudi', {
                method: 'POST',
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(bodyToSend)
            })

        })

    };

    sendDataProducts(name,sku,cantidad,total){
        window.addEventListener('beforeunload', e => {

            let bodyToSend = {
                idCompany: this.idCompany,
                nameProduct: name,
                skuNumber: sku,
                quantity: cantidad,
                totalValue:total       
             
            };

            const request = fetch('https://viewer.mudi.com.co:3589/api/mudiv1/dataProductsPurchase', {
                method: 'POST',
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(bodyToSend)
            })

        })

    }


    /** TurnOn pixel Mudi */
    async pixelMudiOn() {

        await this.identifyUserMudi();

        this.userID && (

            /** Verify Testing AB */
            this.verifyTestingAB(),

            /** DOM VERIFY */

            /** Verify  add To Car */
            this.verifyAddToCar(),
            /** Verify Categories */
            this.verifyCategory(),
            /** Verify skuNumber */
            this.verifySku(),
            /** Verify Ourchase */
            this.verifyPurchase(),

            /** Verify PDP 3D Btn And Evetns interaction 3D  & AR  */
            this.verifyContainerBtnsMudi(),

            /** INFO GENERAL  */

            /* Get Path direction */
            this.getPath(),
            /* Recognized device */
            this.recognizeDevice(),
            /* Get Date */
            this.getDate(),
            /* get Time in Session */
            this.timeSesion(),

            /* event To Send */
            this.addEventBeforeUnload()

        );

        if (location.pathname == '/checkout') {


            const toalprodcutos = document.querySelectorAll('.media');
            let name, sku, cantidad;

            toalprodcutos.forEach(node => {
                name = node.querySelector('.media-heading').innerHTML;
                sku = node.querySelector('.media-content-details').children[1].innerHTML;
                cantidad = node.querySelector('.media-content-details').children[5].innerHTML;
            })

            const total = document.getElementById('data-total').innerHTML.replace('$', '');

            document.body.querySelector('.send-event-purchase').addEventListener('click', () => {
                console.log(
                    name,
                    sku,
                    cantidad,
                    total,
                )

                /** Toca mirar si toca mandarle parametros o no  */
                this.sendDataProducts(name,sku,cantidad,total);
            })

        }

    };

};

const mudiPixel = new MudiPixel();
window.mudiPixel = mudiPixel;
mudiPixel.pixelMudiOn();


/** Mudi Experience */
class MudiExperience {
  constructor() {
    this.color = "#03457c";
    this.dataSever = null;
    this.skuNumber = null;
    this.fatherContainer = null;

    this.flagTesting = true;
  }

  /** Conect mudiServer  ✔️ */
  async conectServer(skuNumber) {
    const myBody = { skus: [skuNumber] };
    this.skuNumber = skuNumber;

    try {
      /** We make the request to the MUDI server */
      const request = await fetch(
        "https://mudiview.mudi.com.co:7443/product/getProductsUrl",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            tokenapi: "GjSAn4bGJZzU4cZnZP5q",
          },
          body: JSON.stringify(myBody),
        }
      );
      const response = await request.json();
      this.dataServer = response.data[0];
    } catch (error) {
      console.error(`Mudi Error:\n${error}`);
    }
  }

  /** Create Styles ✔️ */
  createStyles() {
    /** Verify element HTML */
    if (document.head.querySelector("#stylesMudiGeneral")) {
      return;
    }

    const link = document.createElement("LINK");
    link.setAttribute("rel", "stylesheet");
    link.id = "stylesMudiGeneral";
    link.href = `https://cdn.jsdelivr.net/gh/RodriguezJose92/amoblando@latest/index.css`; /* custom this path */

    document.head.appendChild(link);
  }

  /** Create button only 3D  ✔️*/
  createBtns() {
    /** Verify btns */
    document.body.querySelector(".btnsMudiContainer") &&
      document.body.querySelector(".btnsMudiContainer").remove();

    /** Create Fragment */
    const fragment = document.createDocumentFragment();

    /** Create containers */
    const containerBtns = document.createElement("DIV");
    containerBtns.classList.add("btnsMudiContainer");
    containerBtns.appendChild(this.createTooltip());
    containerBtns.setAttribute("skuNumber", this.skuNumber);
    containerBtns.innerHTML += `
        <?xml version="1.0" encoding="UTF-8"?>
            <svg id="img3DBtn" class="btnMudi3D" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360">
                <defs>
                    <style>
                        .cls-1{
                            fill:${this.color};
                            opacity:.6;
                        }
                        
                        .cls-1,.cls-2,.cls-3{
                            stroke-width:0px;
                        }
                        .cls-2{
                            fill:#f4f4f4;
                        }
                        .cls-3{
                            fill:${this.color};
                        }
                    </style>
                </defs>
                <circle class="cls-2" cx="170" cy="178.45" r="150.5"/>
                <g id="vert3b-thumb">
                    <path id="Shape" class="cls-1" d="m270.61,176.12c0-20.59-22.41-38-55.68-46.34-8.14-34.05-25.18-56.97-45.29-56.97s-37.14,22.96-45.3,57.04c-4.71,1.2-9.26,2.58-13.59,4.16-1.88.69-2.86,2.8-2.18,4.72.67,1.92,2.74,2.92,4.62,2.24,3.04-1.11,6.21-2.08,9.45-2.98-.41,2.27-.77,4.53-1.11,6.84h.19c-3.33,22.19-3.12,44.79.61,66.91h-.09c.15.81.28,1.65.43,2.49v.04c-27.7-7.79-46.71-22.1-46.72-38.07,0-8.41,5.43-16.79,15.41-24.01l-1.15,6.06h0c-.19.97,0,1.97.54,2.79.54.82,1.37,1.38,2.32,1.57h0c.23.05.46.07.69.07,1.72-.02,3.2-1.26,3.54-2.99l2.9-15.36h0c.18-.96-.01-1.95-.55-2.76-.53-.81-1.36-1.37-2.3-1.55h0l-15.07-3.11c-1.94-.41-3.85.84-4.3,2.82-.1.48-.1.98,0,1.46.26,1.46,1.35,2.63,2.77,2.95h.17l7.05,1.4c-12.44,8.79-19.31,19.49-19.31,30.6h0c0,20.59,22.41,38,55.68,46.35,8.16,34.04,25.18,56.96,45.29,56.96,11.18,0,21.93-7.46,30.61-20.88l.9,7.36c.24,2.02,2.04,3.46,4.01,3.22,1.98-.25,3.38-2.08,3.14-4.11h0l-1.82-15.54c-.11-.97-.6-1.86-1.35-2.46-.75-.61-1.71-.88-2.66-.76h0l-15.19,1.87c-1.97.25-3.38,2.09-3.14,4.1h0c.24,2.02,2.03,3.46,4.01,3.22l5.99-.74c-7.26,11.15-15.84,17.31-24.45,17.31-15.61,0-29.58-19.46-37.21-47.77,12.27,2.37,24.73,3.55,37.21,3.51,12.51.04,24.99-1.15,37.28-3.53-.89,3.31-1.82,6.56-2.91,9.66-.16.47-.23.96-.19,1.45.09,1.76,1.38,3.2,3.08,3.45s3.34-.77,3.91-2.43h0c1.54-4.43,2.89-9.09,4.07-13.91,33.31-8.35,55.75-25.76,55.75-46.35h0l-.03.03Zm-53.98,38.09c2.35-12.55,3.52-25.3,3.49-38.08h0c.04-12.77-1.11-25.51-3.43-38.06,27.69,7.8,46.7,22.1,46.71,38.07,0,15.97-19.05,30.27-46.76,38.07h0Zm-84.21-86.17c7.61-28.35,21.6-47.83,37.22-47.83s29.58,19.45,37.21,47.78c-1.12-.22-2.22-.41-3.34-.62v.14c-11.19-2.01-22.53-3.03-33.89-3.03-10.91.03-21.79,1-32.54,2.89l.07-.2c-1.57.28-3.15.57-4.73.88Zm76.36,8.03c2.77,13.16,4.15,26.6,4.12,40.06.04,13.45-1.31,26.88-4.05,40.04-12.89,2.84-26.04,4.26-39.22,4.22-13.16.04-26.29-1.38-39.15-4.21v-.15c-5.48-26.38-5.48-53.65,0-80.04,25.82-5.54,52.49-5.52,78.3.07h0Z"/>
                    <path id="Path" class="cls-3" d="m122.61,187.91c4.2,4.12,9.83,6.44,15.7,6.49,6.91,0,10.75-2.98,10.75-7.34,0-4.61-3.51-6.75-11.43-6.75-2.39,0-6.24,0-7.09.09v-10.59c1.02.08,4.86.08,7.09.08,6.31,0,10.5-2.05,10.5-6.31,0-4.52-4.61-6.83-10.58-6.83-5.43,0-10.65,2.14-14.51,5.97l-5.98-7.51c5.57-6.07,13.53-9.38,21.76-9.06,13.31,0,21.51,5.97,21.51,15.44-.45,6.78-5.7,12.26-12.46,12.98,7.27.48,13.01,6.37,13.31,13.65,0,9.81-8.79,16.73-22.44,16.73-8.47.46-16.7-2.88-22.45-9.12l6.32-7.94Z"/>
                    <path id="Shape-2" class="cls-3" d="m170.32,147.04h22.45c17.83,0,30.21,11.35,30.21,28.51s-12.38,28.42-30.21,28.42h-22.45v-56.93Zm22.45,46.26c4.78.23,9.44-1.56,12.84-4.94,3.39-3.38,5.21-8.03,4.99-12.81.36-4.83-1.41-9.58-4.83-13-3.42-3.43-8.17-5.19-13-4.84h-10.33v35.59h10.33Z"/>
                </g>
            </svg>
        `;

    containerBtns.querySelector("#img3DBtn").addEventListener("click", () => {
      this.createModal();
      /** GTM */
      this.sendEventInteraction("3D");
    });

    fragment.appendChild(containerBtns);

    /** Add DOM */
    this.fatherContainer.appendChild(fragment);
  }

  /** Create Modal ✔️ */
  createModalPLP(skuNumber, link, referenceColors,combination) {
    let colorOptionsHTML = `
    
      <div id="colorSelect" class="color-buttons" style="display: flex; align-items: center; gap: 0.5rem; position: absolute; bottom: 33px; z-index: 1000;">
    `;
  
    /** Se agregan los colores como botones donde el valor es el sku */
    referenceColors.forEach((item) => {
      colorOptionsHTML += `
        <button 
          class="color-button" 
          value="${item.sku}" 
          style="background-image: url(${item.textura}); background-size: cover; border: ${item.sku === skuNumber ? '2px solid black' : 'none'}; width: 40px; height: 40px; border-radius: 50%; flex: 0 0 40px;" 
          ${item.sku === skuNumber ? 'data-selected="true"' : ''}
        >
        </button>
      `;
    });
    colorOptionsHTML += "</div>";
    /** Crear variables */
    let flagAR = false;

    /** Crear el contenedor para el modal */
    const modalMudi = document.createElement("DIV");
    modalMudi.id = 'modalMudi';
    modalMudi.classList.add('mudiModal');
    modalMudi.innerHTML = `
        <div class="iframeMudi3D" style="position: relative;">
            <button class="closeModalMudi" style="color:${this.color}">X</button>
            <a class="goToSite3D" style="display:block" href="${link}">Ver más detalles</a>
            ${colorOptionsHTML}
            <iframe id="iframeMudi" class="modelMudi" src="https://viewer.mudi.com.co/v1/web/?id=147&sku=${skuNumber}"></iframe> 
            <div class="containerBtnsActions">
            <svg xmlns="http://www.w3.org/2000/svg" id="imgARBtn" class="imgBtnAR" viewBox="0 0 317 112">
            <defs>
                <style>
                .cls-1_modal{fill:${this.color};stroke:${this.color};stroke-miterlimit:10;stroke-width:3px;}
                .cls-2_modal{font-family:FrutigerBold, Frutiger;font-size:19.04px;fill:white}
                .cls-3_modal{stroke-width:0px;fill:white;}
                </style>
            </defs>
            
            <rect class="cls-1_modal" x="9.52" y="9" width="292.07" height="87" rx="40" ry="40"/>
                <path class="cls-3_modal" d="m42.64,46.07c.66,0,1.19-.53,1.19-1.19v-8.1c0-.66-.53-1.19-1.19-1.19s-1.19.53-1.19,1.19v8.04c0,.66.53,1.19,1.19,1.19"/>
                <path class="cls-3_modal" d="m59.58,28.25c.21,0,.42-.06.6-.16l6.4-3.67,6.4,3.68c.57.33,1.31.13,1.64-.44.33-.57.13-1.31-.44-1.64h0l-7.13-4.01c-.37-.21-.83-.21-1.19,0l-6.94,4.02c-.57.34-.75,1.07-.41,1.64.23.38.64.6,1.08.58"/>
                <path class="cls-3_modal" d="m66.5,59.88c.66,0,1.19-.53,1.19-1.19v-8.03c0-.66-.54-1.2-1.2-1.2s-1.2.54-1.2,1.2v8.04c0,.66.53,1.19,1.19,1.19"/>
                <path class="cls-3_modal" d="m90.39,46.07c.66,0,1.19-.53,1.19-1.19,0,0,0,0,0-.01v-8.09c0-.66-.53-1.19-1.19-1.19s-1.19.53-1.19,1.19v8.04c0,.66.53,1.19,1.19,1.19"/>
                <path class="cls-3_modal" d="m42.64,65.58c.66,0,1.19-.53,1.19-1.19v-7.99c0-.66-.53-1.19-1.19-1.19s-1.19.53-1.19,1.19v8.04c.03.64.56,1.14,1.19,1.14Z"/>
                <path class="cls-3_modal" d="m90.39,65.58c.64,0,1.17-.5,1.19-1.14v-8.04c0-.66-.53-1.19-1.19-1.19s-1.19.53-1.19,1.19h0v8.04c.03.64.56,1.14,1.19,1.14"/>
                <path class="cls-3_modal" d="m66.5,33.02c.66,0,1.19-.53,1.19-1.19v-8.77c0-.66-.54-1.2-1.2-1.2s-1.2.54-1.2,1.2v8.77c0,.66.53,1.19,1.19,1.19"/>
                <path class="cls-3_modal" d="m66.5,79.45c.66,0,1.19-.53,1.19-1.19h0v-8.04c0-.66-.54-1.2-1.2-1.2s-1.2.54-1.2,1.2v8.04c0,.66.53,1.19,1.19,1.19,0,0,0,0,.01,0"/>
                <path class="cls-3_modal" d="m66.5,79.45c.21,0,.42-.06.6-.16l7-4.04c.57-.33.77-1.06.44-1.64-.33-.57-1.06-.77-1.64-.44h0l-6.4,3.7-6.3-3.66c-.57-.33-1.31-.14-1.64.44s-.14,1.31.44,1.64l6.91,4c.18.11.39.16.6.16"/>
                <path class="cls-3_modal" d="m66.5,51.83c.19,0,.37-.04.54-.12l6.97-4.02c.57-.33.77-1.06.44-1.64-.33-.57-1.06-.77-1.64-.44l-6.4,3.68-6.4-3.68c-.57-.33-1.31-.14-1.64.44s-.14,1.31.44,1.64h0l7.08,4.02c.18.11.39.16.6.16"/>
                <path class="cls-3_modal" d="m49.61,42.05c.66.01,1.2-.52,1.21-1.18,0-.44-.23-.85-.62-1.06l-6.95-4.02c-.59-.3-1.31-.07-1.61.52-.28.54-.1,1.2.4,1.54l6.95,4.02c.18.1.39.16.6.16"/>
                <path class="cls-3_modal" d="m42.65,38.03c.21,0,.42-.06.6-.16l6.97-4.02c.57-.33.77-1.06.44-1.64s-1.06-.77-1.64-.44h0l-6.97,4.02c-.58.32-.79,1.05-.47,1.62.21.39.62.62,1.06.62"/>
                <path class="cls-3_modal" d="m83.42,42.05c.21,0,.42-.06.6-.16l6.97-4.04c.57-.33.77-1.06.44-1.64-.33-.57-1.06-.77-1.64-.44l-6.95,4.02c-.58.32-.79,1.05-.47,1.62.21.39.62.62,1.06.62"/><path class="cls-3_modal" d="m90.39,38.03c.66.01,1.2-.52,1.21-1.18,0-.44-.23-.85-.62-1.06l-6.95-4.01c-.57-.33-1.31-.13-1.64.44-.33.57-.13,1.31.44,1.64l6.95,3.99c.18.1.39.16.6.16"/>
                <path class="cls-3_modal" d="m49.62,69.66c.66.01,1.2-.52,1.21-1.18,0-.44-.23-.85-.62-1.06l-6.98-3.97c-.57-.33-1.31-.13-1.64.44s-.13,1.31.44,1.64h0l6.98,3.97c.18.1.39.16.6.16"/>
                <path class="cls-3_modal" d="m42.64,65.58c.21,0,.42-.06.6-.16l6.97-4.02c.57-.33.77-1.06.44-1.64-.33-.57-1.06-.77-1.64-.44h0l-6.97,4.13c-.58.32-.79,1.05-.47,1.62.21.39.62.62,1.06.62"/>
                <path class="cls-3_modal" d="m83.42,69.66c.21,0,.42-.06.6-.16l6.97-4.02c.51-.42.57-1.18.15-1.68-.33-.39-.87-.53-1.35-.34l-6.95,4.02c-.58.32-.79,1.05-.47,1.62.21.39.62.62,1.06.62"/>
                <path class="cls-3_modal" d="m90.39,65.58c.66.01,1.2-.52,1.21-1.18,0-.44-.23-.85-.62-1.06l-6.94-4.02c-.57-.33-1.31-.14-1.64.44-.33.57-.14,1.31.44,1.64l6.94,4.07c.18.1.39.16.6.16"/>
        
                <text class="cls-2_modal" transform="translate(103.37 58.47)"><tspan x="0" y="0">VER EN TU ESPACIO</tspan></text>
            </svg>
                <div id="containerQR" class="containerQRMudi" style="background-color:${this.color}">
                    <img class="mudiQR" src="https://viewer.mudi.com.co/v1/qr/?id=147&sku=${skuNumber}" >
                    <div class="containerText">
                        <div class="titleContainer">
                            <h4>ESCANÉAME PARA <br><b>VER EN TU ESPACIO</b></h4>
                            <hr class="hrTitle">
                        </div>
                        <div class="titleContainer">
                            <div class="iconTitle">
                                <img class="stepMudi step1" src="https://cdn.jsdelivr.net/gh/RodriguezJose92/amoblando@latest/assets/step3amoblando.webp">
                            </div>
                            <p class="textInfoMudi">Apunta el teléfono al piso.</p>
                        </div>
                        <div class="titleContainer">
                            <div class="iconTitle">
                                <img class="stepMudi step2" src="https://cdn.jsdelivr.net/gh/RodriguezJose92/amoblando@latest/assets/step4amoblando.webp">
                            </div>
                            <p class="textInfoMudi">Desplaza para visualizar.</p>
                        </div>
                        <div class="titleContainer">
                            <div class="iconTitle">
                                <img class="stepMudi step3" src="https://cdn.jsdelivr.net/gh/RodriguezJose92/amoblando@latest/assets/step2amoblando.webp">
                            </div>
                            <p class="textInfoMudi">Amplia y detalla el producto.</p>
                        </div>
                        <div class="titleContainer">
                            <div class="iconTitle">
                                <img class="stepMudi step4" src="https://cdn.jsdelivr.net/gh/RodriguezJose92/amoblando@latest/assets/step1amoblando.webp">
                            </div>
                            <p class="textInfoMudi">Toca dos veces para restablecer.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

   /** Agregar event listener para el cambio de color */
  const colorButtons = modalMudi.querySelectorAll(".color-button");
  const iframeMudi = modalMudi.querySelector("#iframeMudi");
  const qrMudi = modalMudi.querySelector('.mudiQR');
  const verDetalles = modalMudi.querySelector('.goToSite3D');
  
  colorButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const selectedSku = e.target.value;
      const selectedIdOption = referenceColors.find(item => item.sku === selectedSku).idOption;
      if (typeof link !== 'string') {
        link = String(link);
      }
      const updatedLink = link.replace(/#\d+/, `#${selectedIdOption}`);
      verDetalles.href = `${updatedLink}`
  
      // Actualizar el iframe y el QR con el nuevo SKU
      iframeMudi.src = `https://viewer.mudi.com.co/v1/web/?id=147&sku=${selectedSku}`;
      qrMudi.src = `https://viewer.mudi.com.co/v1/qr/?id=147&sku=${selectedSku}`;
  
      // Actualizar la apariencia del botón seleccionado
      colorButtons.forEach(btn => btn.style.border = 'none');
      e.target.style.border = '2px solid red';
    });
  });
  

    
    /** Cerrar el modal */
    modalMudi.querySelector(".closeModalMudi").addEventListener("click", () => {
      if (document.body.contains(modalMudi)) {
        document.body.removeChild(modalMudi);
      }
    });

    /** Inicializar ARExperience */
    modalMudi.querySelector(`#imgARBtn`).addEventListener("click", () => {
      if (window.innerWidth > 1000) {
        !flagAR
          ? ((document.body.querySelector(".containerQRMudi").style.right =
            "15%"),
            changeStyleBtnAR(flagAR, this.color),
            (flagAR = !flagAR))
          : ((document.body.querySelector(".containerQRMudi").style.right =
            "0vw"),
            changeStyleBtnAR(flagAR, this.color),
            (flagAR = !flagAR));
      } else {
        window.open(`https://viewer.mudi.com.co/v1/ar/?id=147&sku=${skuNumber}`, "_BLANK");
      }
      flagAR && this.sendEventInteraction("AR");
    });

     /** Verify Style Bttn AR  */
  function changeStyleBtnAR(flagAR, color) {
    let icon = document.body.querySelectorAll(".cls-3_modal");

    flagAR
      ? ((document.body.querySelector(".cls-1_modal").style.fill = color),
        icon.forEach((icon) => (icon.style.fill = "white")),
        (document.body.querySelector(".cls-2_modal").style.fill = "white"))
      : ((document.body.querySelector(".cls-1_modal").style.fill = "white"),
        icon.forEach((icon) => (icon.style.fill = color)),
        (document.body.querySelector(".cls-2_modal").style.fill = color));
  }
    
    document.body.appendChild(modalMudi);
  }

  /** Create Modal ✔️ */
  createModal() {
    /** create variables */
    let flagAR = false;

    /** We create a shell for the MUDI modal */
    const modalMudi = document.createElement("DIV");
    modalMudi.id = `modalMudi`;
    modalMudi.classList.add(`mudiModal`);
    modalMudi.innerHTML = `
            <div class="iframeMudi3D">
                <button class="closeModalMudi" style="color:${this.color}">X</button>
                <iframe class="modelMudi" src="${this.dataServer.URL_WEB}"></iframe>
                <div class="containerBtnsActions">
                    <svg xmlns="http://www.w3.org/2000/svg" id="imgARBtn" class="imgBtnAR" viewBox="0 0 317 112">
                    <defs>
                        <style>
                        .cls-1_modal{fill:${this.color};stroke:${this.color};stroke-miterlimit:10;stroke-width:3px;}
                        .cls-2_modal{font-family:FrutigerBold, Frutiger;font-size:19.04px;fill:white}
                        .cls-3_modal{stroke-width:0px;fill:white;}
                        </style>
                    </defs>
                    
                    <rect class="cls-1_modal" x="9.52" y="9" width="292.07" height="87" rx="40" ry="40"/>
                        <path class="cls-3_modal" d="m42.64,46.07c.66,0,1.19-.53,1.19-1.19v-8.1c0-.66-.53-1.19-1.19-1.19s-1.19.53-1.19,1.19v8.04c0,.66.53,1.19,1.19,1.19"/>
                        <path class="cls-3_modal" d="m59.58,28.25c.21,0,.42-.06.6-.16l6.4-3.67,6.4,3.68c.57.33,1.31.13,1.64-.44.33-.57.13-1.31-.44-1.64h0l-7.13-4.01c-.37-.21-.83-.21-1.19,0l-6.94,4.02c-.57.34-.75,1.07-.41,1.64.23.38.64.6,1.08.58"/>
                        <path class="cls-3_modal" d="m66.5,59.88c.66,0,1.19-.53,1.19-1.19v-8.03c0-.66-.54-1.2-1.2-1.2s-1.2.54-1.2,1.2v8.04c0,.66.53,1.19,1.19,1.19"/>
                        <path class="cls-3_modal" d="m90.39,46.07c.66,0,1.19-.53,1.19-1.19,0,0,0,0,0-.01v-8.09c0-.66-.53-1.19-1.19-1.19s-1.19.53-1.19,1.19v8.04c0,.66.53,1.19,1.19,1.19"/>
                        <path class="cls-3_modal" d="m42.64,65.58c.66,0,1.19-.53,1.19-1.19v-7.99c0-.66-.53-1.19-1.19-1.19s-1.19.53-1.19,1.19v8.04c.03.64.56,1.14,1.19,1.14Z"/>
                        <path class="cls-3_modal" d="m90.39,65.58c.64,0,1.17-.5,1.19-1.14v-8.04c0-.66-.53-1.19-1.19-1.19s-1.19.53-1.19,1.19h0v8.04c.03.64.56,1.14,1.19,1.14"/>
                        <path class="cls-3_modal" d="m66.5,33.02c.66,0,1.19-.53,1.19-1.19v-8.77c0-.66-.54-1.2-1.2-1.2s-1.2.54-1.2,1.2v8.77c0,.66.53,1.19,1.19,1.19"/>
                        <path class="cls-3_modal" d="m66.5,79.45c.66,0,1.19-.53,1.19-1.19h0v-8.04c0-.66-.54-1.2-1.2-1.2s-1.2.54-1.2,1.2v8.04c0,.66.53,1.19,1.19,1.19,0,0,0,0,.01,0"/>
                        <path class="cls-3_modal" d="m66.5,79.45c.21,0,.42-.06.6-.16l7-4.04c.57-.33.77-1.06.44-1.64-.33-.57-1.06-.77-1.64-.44h0l-6.4,3.7-6.3-3.66c-.57-.33-1.31-.14-1.64.44s-.14,1.31.44,1.64l6.91,4c.18.11.39.16.6.16"/>
                        <path class="cls-3_modal" d="m66.5,51.83c.19,0,.37-.04.54-.12l6.97-4.02c.57-.33.77-1.06.44-1.64-.33-.57-1.06-.77-1.64-.44l-6.4,3.68-6.4-3.68c-.57-.33-1.31-.14-1.64.44s-.14,1.31.44,1.64h0l7.08,4.02c.18.11.39.16.6.16"/>
                        <path class="cls-3_modal" d="m49.61,42.05c.66.01,1.2-.52,1.21-1.18,0-.44-.23-.85-.62-1.06l-6.95-4.02c-.59-.3-1.31-.07-1.61.52-.28.54-.1,1.2.4,1.54l6.95,4.02c.18.1.39.16.6.16"/>
                        <path class="cls-3_modal" d="m42.65,38.03c.21,0,.42-.06.6-.16l6.97-4.02c.57-.33.77-1.06.44-1.64s-1.06-.77-1.64-.44h0l-6.97,4.02c-.58.32-.79,1.05-.47,1.62.21.39.62.62,1.06.62"/>
                        <path class="cls-3_modal" d="m83.42,42.05c.21,0,.42-.06.6-.16l6.97-4.04c.57-.33.77-1.06.44-1.64-.33-.57-1.06-.77-1.64-.44l-6.95,4.02c-.58.32-.79,1.05-.47,1.62.21.39.62.62,1.06.62"/><path class="cls-3_modal" d="m90.39,38.03c.66.01,1.2-.52,1.21-1.18,0-.44-.23-.85-.62-1.06l-6.95-4.01c-.57-.33-1.31-.13-1.64.44-.33.57-.13,1.31.44,1.64l6.95,3.99c.18.1.39.16.6.16"/>
                        <path class="cls-3_modal" d="m49.62,69.66c.66.01,1.2-.52,1.21-1.18,0-.44-.23-.85-.62-1.06l-6.98-3.97c-.57-.33-1.31-.13-1.64.44s-.13,1.31.44,1.64h0l6.98,3.97c.18.1.39.16.6.16"/>
                        <path class="cls-3_modal" d="m42.64,65.58c.21,0,.42-.06.6-.16l6.97-4.02c.57-.33.77-1.06.44-1.64-.33-.57-1.06-.77-1.64-.44h0l-6.97,4.13c-.58.32-.79,1.05-.47,1.62.21.39.62.62,1.06.62"/>
                        <path class="cls-3_modal" d="m83.42,69.66c.21,0,.42-.06.6-.16l6.97-4.02c.51-.42.57-1.18.15-1.68-.33-.39-.87-.53-1.35-.34l-6.95,4.02c-.58.32-.79,1.05-.47,1.62.21.39.62.62,1.06.62"/>
                        <path class="cls-3_modal" d="m90.39,65.58c.66.01,1.2-.52,1.21-1.18,0-.44-.23-.85-.62-1.06l-6.94-4.02c-.57-.33-1.31-.14-1.64.44-.33.57-.14,1.31.44,1.64l6.94,4.07c.18.1.39.16.6.16"/>
                
                        <text class="cls-2_modal" transform="translate(103.37 58.47)"><tspan x="0" y="0">VER EN TU ESPACIO</tspan></text>
                    </svg>

                    <div id="containerQR" class="containerQRMudi" style="background-color:${this.color}">
                        <img class="mudiQR" src="${this.dataServer.URL_QR}" >

                        <div class="containerText">
                            <div class="titleContainer">
                                <h4>ESCANÉAME PARA <br><b>VER EN TU ESPACIO</b></h4>
                                <hr class="hrTitle">
                            </div>

                            <div class="titleContainer">
                                <div class="iconTitle">
                                    <img class="stepMudi step1" src="https://cdn.jsdelivr.net/gh/RodriguezJose92/amoblando@latest/assets/step3amoblando.webp">
                                </div>
                                <p class="textInfoMudi">Apunta el teléfono al piso.</p>
                            </div>

                            <div class="titleContainer">
                                <div class="iconTitle">
                                    <img class="stepMudi step2" src="https://cdn.jsdelivr.net/gh/RodriguezJose92/amoblando@latest/assets/step4amoblando.webp">
                                </div>
                                <p class="textInfoMudi">Desplaza para visualizar.</p>
                            </div>

                            <div class="titleContainer">
                                <div class="iconTitle">
                                    <img class="stepMudi step3" src="https://cdn.jsdelivr.net/gh/RodriguezJose92/amoblando@latest/assets/step2amoblando.webp">
                                </div>
                                <p class="textInfoMudi">Amplia y detalla el producto.</p>
                            </div>

                            <div class="titleContainer">
                                <div class="iconTitle">
                                    <img class="stepMudi step4" src="https://cdn.jsdelivr.net/gh/RodriguezJose92/amoblando@latest/assets/step1amoblando.webp">
                                </div>
                                <p class="textInfoMudi">Toca dos veces para restablecer.</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        `;

    /** We close the MUDI modal*/
    modalMudi.querySelector(`.closeModalMudi`).addEventListener("click", () => {
      document.body.querySelector("#modalMudi").remove();
    });

    /** Init ARExperience */
    modalMudi.querySelector(`#imgARBtn`).addEventListener("click", () => {
      if (window.innerWidth > 1000) {
        !flagAR
          ? ((document.body.querySelector(".containerQRMudi").style.right =
            "15%"),
            changeStyleBtnAR(flagAR, this.color),
            (flagAR = !flagAR))
          : ((document.body.querySelector(".containerQRMudi").style.right =
            "-150%"),
            changeStyleBtnAR(flagAR, this.color),
            (flagAR = !flagAR));
      } else {
        window.open(`${this.dataServer.URL_AR}`, "_BLANK");
      }
      flagAR && this.sendEventInteraction("AR");
    });

    /** Verify Style Bttn AR  */
    function changeStyleBtnAR(flagAR, color) {
      let icon = document.body.querySelectorAll(".cls-3_modal");

      flagAR
        ? ((document.body.querySelector(".cls-1_modal").style.fill = color),
          icon.forEach((icon) => (icon.style.fill = "white")),
          (document.body.querySelector(".cls-2_modal").style.fill = "white"))
        : ((document.body.querySelector(".cls-1_modal").style.fill = "white"),
          icon.forEach((icon) => (icon.style.fill = color)),
          (document.body.querySelector(".cls-2_modal").style.fill = color));
    }

    document.body.appendChild(modalMudi);
  }

  /** create tooltip ✔️ */
  createTooltip() {
    const tooltip = document.createElement("P");
    tooltip.classList.add("tooltipMudi");
    tooltip.innerHTML = `<b>¡Nuevo!</b> Descubre como se ve este producto en 3D y realidad aumentada en tu espacio`;

    setTimeout(() => {
      document.body.querySelector(".tooltipMudi").remove();
    }, 9000);

    return tooltip;
  }

  /** Send Evnt Interacción  ✔️ */
  sendEventInteraction(eventName) {
    let OSdevice;

    if (navigator.userAgent.includes("Android")) OSdevice = "Android";
    else if (
      navigator.userAgent.includes("iPhone") ||
      navigator.userAgent.includes("iPad")
    )
      OSdevice = "IOS";
    else OSdevice = "DESK";

    window.dataLayer &&
      dataLayer.push({
        event: `Evento de interaccion ${eventName}`,
        valorMudi: 1,
        sku: this.skuNumber,
        sistemaOperativo: OSdevice,
      });
  }

  /** viewer event Mudi GTM  */
  sendEventViewer() {
    let OSdevice;

    if (navigator.userAgent.includes("Android")) OSdevice = "Android";
    else if (
      navigator.userAgent.includes("iPhone") ||
      navigator.userAgent.includes("iPad")
    )
      OSdevice = "IOS";
    else OSdevice = "DESK";

    window.dataLayer &&
      dataLayer.push({
        event: `visualizacion_botones`,
        valorMudi: 1,
        sku: this.skuNumber,
        sistemaOperativo: OSdevice,
      });
  }

  /** verifyExperience  ✔️ */
  async experienceOn(skuNumber, fatherContainer) {
    /** Verify father Container */
    fatherContainer && (this.fatherContainer = fatherContainer);

    /** Response Mudi server */
    await this.conectServer(skuNumber);

    /** verify process */
    if (!this.dataServer) {
      document.body.querySelector(".btnsMudiContainer") &&
        document.body.querySelector(".btnsMudiContainer").remove();
      console.warn(`El sku: ${skuNumber} no posee experiencias de 3D  y AR`);
      return;
    }

    /** Create Styles */
    this.createStyles();

    /** Create Buttons */
    this.createBtns();

    /** Viewer event GTM  */
    this.sendEventViewer();
  }
}

const mudiExperience = new MudiExperience();

setTimeout(() => {
  const btnCategory = document.querySelectorAll(".imgMundi.iconCatMudi_3D");
  const thumbnailDivs = document.querySelectorAll(".thumbnail-images");

  btnCategory.forEach((child, index) => {
    child.removeEventListener('click', () => {});
    child.addEventListener("click", async (e) => {
      e.stopPropagation();

      const relatedThumbnailDiv = thumbnailDivs[index];
      const link = relatedThumbnailDiv.querySelector("a");
      const url = link ? link.getAttribute("href") : null;
      const inputColorMudi = relatedThumbnailDiv.querySelector("#referenceColorMudi");
      const colorCombination = relatedThumbnailDiv.querySelector("#referenceCombinationsMudi")
      
      let colorsMudi = inputColorMudi ? JSON.parse(inputColorMudi.value) : [];      
      let colorCombinations = colorCombination ? JSON.parse(colorCombination.value) : [];
      console.log(colorCombinations);
      mudiExperience.createStyles();
      mudiExperience.createModalPLP(
        e.target.attributes.sku.value,
        link,
        colorsMudi,
        colorCombinations
      );
    });
  });
}, 2000);
