$(function (){
    

    const id = window.location.pathname.split('/').pop();
    
    const products = [
        {
            "id": 1,
            "nome": "Vital Silt",
            "img": "/assets/silt1.png",
            "price": 200,
            "parcela" : "6x R$20,00",

        },
        {
            "id": 2,
            "nome": "Silt Essence",
            "img": "/assets/silt2.png",
            "price": 200,
            "parcela" : "6x R$20,00",

        },
        {
            "id": 3,
            "nome": "Nutri Silt",
            "img": "/assets/silt3.png",
            "price": 200,
            "parcela" : "6x R$20,00",

        },
       
    ];


    // Exemplo de função anônima auto-invocada
    (function () {
        const prod = products[id - 1]
        $('.produto-content').append(`
            <div class="prod-cont">
                <div class="produto-imagem">
                    <img src="${prod.img}" alt="">
                </div>
                <div class="produto-infos">
                    <span class="prod-title" >${prod.nome}</span>
                    <div class="prod-prices" >
                        <span>R$${prod.price},00</span>
                        <span>${prod.parcela}</span>
                    </div>
                    <div class="prod-quantity">
                        <div class="prod-qtn" data-quantity="1">
                            <span class="decrease-btn">-</span>
                            <span class="prod-tot">1</span>
                            <span class="increase-btn">+</span>
                        </div>
                        <div class="comprar-btn">
                            Comprar
                        </div>
                    </div>
                </div>
            </div>
        `)


        attachEventHandlers();
    })();





    function attachEventHandlers() {
       
        // Incrementar quantidade
        $(`.produto-content .increase-btn`).on('click', function() {

            let quantityElem = $('.prod-qtn');
            let currentQty = Number(quantityElem.attr('data-quantity'));
            
            currentQty += 1;
            quantityElem.attr('data-quantity', currentQty);
            quantityElem.find('.prod-tot').text(currentQty);
    
            
        });
    
        // Decrementar quantidade
        $(`.produto-content  .decrease-btn`).on('click', function() {


            
            let quantityElem = $('.prod-qtn');
            let currentQty = Number(quantityElem.attr('data-quantity'));
            
            currentQty = currentQty > 1 ? currentQty - 1 : 1;

            
            quantityElem.attr('data-quantity', currentQty);
            quantityElem.find('.prod-tot').text(currentQty);
        });

    }



    $('.comprar-btn').on('click', function(){

        let qtn = Number(($('.prod-qtn').attr('data-quantity')))

        
        let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        
        if( produtos.length != 0){
            
            
            produtos[id - 1].quantity += qtn
            
            produtos[id - 1].amount = produtos[id - 1].quantity * produtos[id - 1].price          


            localStorage.setItem('produtos', JSON.stringify(produtos))
        } else {

            let prod = products[id - 1];
       
            let produto = {
                id: prod.id,
                nome: prod.nome,
                img: prod.img,
                price: prod.price,
                quantity: qtn,
                amount: Number(prod.price) * qtn
            };

            produtos[id - 1] = produto

            localStorage.setItem('produtos', JSON.stringify(produtos) )


        }


        updateCar()
        updateTotalPrice()
        updateTotalItems()
    })



    function updateCar(){

        let prod = products[id - 1]
        if ($('.product-items [data-product="' + prod.id + '"]').length) {
            // Produto já existe, incrementa a quantidade
            let a = $('.product-items [data-product="' + prod.id + '"] .product-item-amount div:nth-of-type(2)');
            let item = $('.product-items [data-product="' + prod.id + '"] .product-item-totalprice');
            let val = Number(a.text());
            
            val += 1;  // Incrementa a quantidade
            let priceItem = Number(prod.price);
            
            item.attr('data-amount', priceItem * val);
            item.text(`R$ ${priceItem * val},00`);
            
            a.text(val);
            a.attr('data-quantity', val);
            
            
    
            
        } else {
            // Produto não existe, adiciona um novo
            $('.product-items').append(`
                <div data-product="${prod.id}" class="product-item">
                    <div class="product-delete">
                        <i class="fa-solid fa-trash"></i>
                    </div>
                    <div class="product-item-img">
                        <img src="${prod.img}" alt="">
                    </div>
                    <div class="product-item-desc">
                        <div class="product-item-title">
                            ${prod.nome}
                        </div>
                        <div class="product-item-price" data-price="${prod.price}">
                            <div class="product-item-amount">
                                <div class="increase-btn">+</div>
                                <div class="quantity" value="1" data-quantity="1">1</div>
                                <div class="decrease-btn">-</div>
                            </div>
                            <div class="product-item-totalprice" data-amount="${prod.price}">
                                R$ ${prod.price},00
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }
    }



    function updateTotalPrice() {

        let produtos = JSON.parse(localStorage.getItem('produtos')) || [];


        let qtn = Number(($('.prod-qtn').attr('data-quantity')))

        let productElem = $(`.product-items [data-product="${id}"]`);
        let price = Number(productElem.find('.product-item-price').attr('data-price'));
    
        let totalPrice = price * qtn;
        productElem.find('.product-item-totalprice').text(`R$ ${totalPrice},00`);
        $('.product-totalprice span:nth-of-type(2)').text(`R$ ${totalPrice},00`);
        $('.header-car-info span:nth-of-type(2)').text(`R$ ${totalPrice},00`);


    }
    
    function updateTotalItems() {

   
        let totalItems = 0;
        let totalPrice = 0;
        let totalQuantity = 0;
        




        $('.product-item-amount .quantity').each(function() {
            totalItems += Number($(this).attr('data-quantity'));
        });


        $('.product-items .product-item-price').each(function(){

            let quantity = $(this).find('.quantity').attr('data-quantity')
            let price = $(this).attr('data-price')

            let tot = Number(price) * Number(quantity);

            totalPrice += tot;
            totalQuantity += quantity

        })


      

        $('.product-totalprice span:nth-of-type(2)').text(`R$ ${totalPrice},00`)
        $('.header-car-info span:nth-of-type(2)').text(`R$ ${totalPrice},00`)

        // Atualiza o valor no span.car-qtn
        $('.car-qtn').attr('value', totalItems);
        $('.car-qtn').text(totalItems);

        
    }

})