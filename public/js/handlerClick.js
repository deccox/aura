$(function() {



    const products = [
        {
            "id": 1,
            "nome": "Serum Teste",
            "img": "/assets/prod1.png",
            "price": 200,
            "parcela" : "6x R$20,00",

        },
        {
            "id": 2,
            "nome": "Serum Teste",
            "img": "/assets/prod1.png",
            "price": 200,
            "parcela" : "6x R$20,00",

        },
        {
            "id": 3,
            "nome": "Serum Teste",
            "img": "/assets/prod1.png",
            "price": 200,
            "parcela" : "6x R$20,00",

        },
        {
            "id": 4,
            "nome": "Serum Teste",
            "img": "/assets/prod1.png",
            "price": 200,
            "parcela" : "6x R$20,00",

        }
    ]
    
    $('.header-car, .modal-overlay').on('click', function(e){
         
            $('.modal').toggleClass('modal-active');
   
    
    })




    $('.header-img').on('click', function(){
        if(window.location.pathname !== '/'){
            window.location.reload()
            window.location.href = '/';
  


        }
    })






    $('.product-button div').on('click', function(e) {
        window.location.href = '/checkout';
       

    });




    let currentIndex = 0;
    const items = $('.carousel-item');
    const totalItems = items.length;

    function showSlide(index) {
        if (index >= totalItems) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = totalItems - 1;
        } else {
            currentIndex = index;
        }

        const newTransform = `translateX(${-currentIndex * 100}%)`;
        $('.carousel-inner').css('transform', newTransform);
    }

    $('.carousel-next').on('click', function() {
        showSlide(currentIndex + 1);
    });

    $('.carousel-prev').on('click', function() {
        showSlide(currentIndex - 1);
    });




    if(window.location.pathname !== "/checkout"){
        let mouseDown = false;
        let startX, scrollLeft;
        const slider = document.querySelector('.produtos');
        
        const startDragging = (e) => {
        mouseDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        }
        
        const stopDragging = (e) => {
        mouseDown = false;
        }
        
        const move = (e) => {
        e.preventDefault();
        if(!mouseDown) { return; }
        const x = e.pageX - slider.offsetLeft;
        const scroll = x - startX;
        slider.scrollLeft = scrollLeft - scroll;
        }
        
        // Add the event listeners
        slider.addEventListener('mousemove', move, false);
        slider.addEventListener('mousedown', startDragging, false);
        slider.addEventListener('mouseup', stopDragging, false);
        slider.addEventListener('mouseleave', stopDragging, false);

    
    }
    

    

    $('.buy-btn').on('click', (e) => {
        let i = $(e.target).attr('data-product');
        let prod = products[i - 1];
        
        let produto = {
            id: prod.id,
            nome: prod.nome,
            img: prod.img,
            price: prod.price,
            quantity: 1,
            amount: prod.price
        };
    
        // Recupera os produtos existentes do localStorage ou inicializa um array vazio
        let prods = JSON.parse(localStorage.getItem('produtos')) || [];
    
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
            
            // Atualiza o objeto do produto
            produto.quantity = val;
            produto.amount = priceItem * val;
    
            
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
    
            // Adiciona o novo produto ao array `prods`
            prods[prod.id - 1] = produto;
    
            // Vincula os eventos de "+" e "-" após adicionar o item
            attachEventHandlers(prod.id);
        }
    
        // Salva o array `prods` atualizado no localStorage
        localStorage.setItem('produtos', JSON.stringify(prods));
        
        updateConfiguration();
        updateTotalItems();
    });
    
    function attachEventHandlers(productId) {
        // Incrementar quantidade
        let prod = products[productId - 1];
        $(`.product-items [data-product="${productId}"] .increase-btn`).on('click', function() {
            let quantityElem = $(this).siblings('.quantity');
            let currentQty = Number(quantityElem.attr('data-quantity'));
    
            currentQty += 1;
            quantityElem.attr('data-quantity', currentQty);
            quantityElem.text(currentQty);
    
            // Atualiza o preço total e a quantidade de itens
            updateTotalPrice(productId, currentQty);
            updateTotalItems(prod);
        });
    
        // Decrementar quantidade
        $(`.product-items [data-product="${productId}"] .decrease-btn`).on('click', function() {


            
            let quantityElem = $(this).siblings('.quantity');
            let currentQty = Number(quantityElem.attr('data-quantity'));
    
            if (currentQty > 1) {
                currentQty -= 1;
            }
    
            quantityElem.attr('data-quantity', currentQty);
            quantityElem.text(currentQty);
    
            // Atualiza o preço total e a quantidade de itens
            updateTotalPrice(productId, currentQty);
            updateTotalItems();
        });
    }
    
    function updateTotalPrice(productId, quantity) {
        let productElem = $(`.product-items [data-product="${productId}"]`);
        let price = Number(productElem.find('.product-item-price').attr('data-price'));
    
        let totalPrice = price * quantity;
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




    function updateConfiguration(){
        $('.product-delete').on('click', function(e) {
            // Mostra o loader
            


            loader();
            
            // Remove o item e atualiza os totais
            this.parentElement.remove();
            updateTotalItems();
            
           
        });
    }


    const loader = () => {
        $('body').append(`<div id="loader" class="loader"></div>`)
        
        
        setTimeout(function() {
            $('.loader').remove();
        }, 1000);


        
    }


















    //checkout
    (function initCheckout(){
        let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        console.log(produtos)

        let tot = 0;
        produtos.forEach((prod, i) => {
            if (prod){
                tot += prod.amount  
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
                                    <div class="quantity" value="1" data-quantity="${prod.quantity}">${prod.quantity}</div>
                                    <div class="decrease-btn">-</div>
                                </div>
                            </div>
                        </div>
                        <div class="product-item-totalprice" data-amount="${prod.amount}">
                                    R$ ${prod.amount},00
                                </div>
                    </div>
                    `)
            }
        })


        $('.pedido-total-item:nth-of-type(1) .pedido-rigth, .pedido-total-item:nth-of-type(3) .pedido-rigth').text(`R$ ${tot},00`)
    }())                  

})