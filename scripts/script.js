
const headerCityButton = document.querySelector('.header__city-button')
const cartListGoods = document.querySelector('.cart__list-goods')
const cartTotalCost = document.querySelector('.cart__total-cost')

let hash = location.hash.substring(1) 

/*if (localStorage.getItem('lomoda-location')) {
    headerCityButton.textContent = localStorage.getItem('lomoda-location')
}*/

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?'

headerCityButton.addEventListener('click', () => {
    const city = prompt('Укажите ваш город')
    headerCityButton.textContent = city
    localStorage.setItem('lomoda-location', city)
});

const getLocalStorage = () => JSON?.parse(localStorage.getItem('cart-lomoda')) || []
const setLocalStorage = data => localStorage.setItem('cart-lomoda', JSON.stringify(data))

const renderCard = () => {
    cartListGoods.textContent = ''

    const cartItems = getLocalStorage()

    let totalPrice = 0

    cartItems.forEach((item, i) => {
        
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${item.brand} ${item.name}</td>
            ${item.color ? `<td>${item.color}</td>` : '<td>-</td>'}
            ${item.sizes ? `<td>${item.sizes}</td>` : '<td>-</td>'}
            <td>${item.cost} &#8381;</td>
            <td><button class="btn-delete" data-id="${item.id}">&times;</button></td>
        `;

        totalPrice += item.cost

        cartListGoods.append(tr)
    })
    cartTotalCost.textContent = totalPrice + ' ₽';
}

const deleteItemCart = id => {
    const cartItems = getLocalStorage()
    const newCarItems = cartItems.filter(item => item.id !== id)
    setLocalStorage(newCarItems)
}

cartListGoods.addEventListener('click', e => {
    if (e.target.matches('.btn-delete')) {
        deleteItemCart(e.target.dataset.id)
        renderCard()
    }
})

//блокировка скролла

const disableScroll = () => {
    const widthScroll = window.innerWidth - document.body.offsetWidth
    document.body.dbScrollY = window.scrollY
    document.body.style.cssText = `
        position: fixed;
        top: ${-window.scrollY}px;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        padding-right: ${widthScroll}px;
    `
}

const enableScroll = () => {
    document.body.style.cssText = ``
    window.scroll({
        top: document.body.dbScrollY
    })
}

//модальное окно

const subheaderCart = document.querySelector('.subheader__cart')
const cartOverlay = document.querySelector('.cart-overlay')

const cartModalOpen = () => {
    cartOverlay.classList.add('cart-overlay-open')
    disableScroll()
    renderCard()
}

const cartModalClose = () => {
    cartOverlay.classList.remove('cart-overlay-open')
    enableScroll()
}

subheaderCart.addEventListener('click', cartModalOpen)

cartOverlay.addEventListener('click', event => {
    const target = event.target
        //target.matches('.cart__btn-close')
    if (target.classList.contains('cart__btn-close') || target.classList.contains('cart-overlay')) {
        cartModalClose()
    }
    
}); 



/**?function closeEsc ( e ) { if ( e . code === "Escape" ) { cartModalClose ( e ) ; }} */

// запрос базы данных

//скрипт для получения данных

const getData = async () => {
    const data = await fetch('db.json')
    if (data.ok) {
        return data.json()
    } else {
        throw new Error(`Данные не были полученыб ошибка ${data.status} ${data.statusText}`)
    }
}

//получили и обработали

const getGoods = (callback, prop, value) => {
    getData()
    .then(data => {
        if (value) {
            callback(data.filter(item => item[prop] === value))
        } else {
            callback(data)
        }
        
    })
    .catch(err => {
        console.error(err)
    })
}

//попробовали, вызвали что все работает
/*getGoods((data) => {
    console.warn(data)
})*/


document.addEventListener('keydown', event => {
    if (cartOverlay.classList.contains('cart-overlay-open')) {
        if (event.key === "Escape") cartModalClose()
    }
})



//страница категорий товара
try {
    const goodsList = document.querySelector('.goods__list')

    if (!goodsList) {
        throw 'This is not a goods page!'
    }

    const goodsTitle = document.querySelector('.goods__title')

    const changeTitle = () => {
        goodsTitle.textContent = document.querySelector(`[href*="#${hash}"]`).textContent
    }

    

    const createCard = ({ id, preview, cost, brand, name, sizes }) => {

        //const { } = data;

        /*const id = data.id
        const preview = data.preview
        const cost = data.cost
        const brand = data.brand
        const name = data.name
        const sizes = data.sizes*/

        const li = document.createElement('li')

        li.classList.add('goods__item')

        li.innerHTML = `
        <article class="good">
                            <a class="good__link-img" href="card-good.html#${id}">
                                <img class="good__img" src="goods-image/${preview}" alt="">
                            </a>
                            <div class="good__description">
                                <p class="good__price">${cost} &#8381;</p>
                                <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                                ${sizes ? 
                                `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` :
                                ''}
                                
                                <a class="good__link" href="card-good.html#${id}">Подробнее</a>
                            </div>
                        </article>
        `

        return li
    }

    const renderGoodList = data => {
        goodsList.textContent = ''

        /*for (let i = 0; i < data.length; i++) {
            console.log('for', data[i])
        }*/

        /*for (const item of data) {
            console.log('for/of' ,item)
        }*/

        data.forEach((item, i, arr) => {
            const card = createCard(item)
            goodsList.append(card)
        });
    }

    window.addEventListener('hashchange', () => {
        hash = location.hash.substring(1)
        getGoods(renderGoodList, 'category', hash)
        changeTitle()
    })
    changeTitle()
    getGoods(renderGoodList, 'category', hash)

} catch (err) {
    console.warn(err)
}

//странца товара
try {
    if (!document.querySelector('.card-good')) {
        throw 'This is not a card-good page'
    }

    const cardGoodImage = document.querySelector('.card-good__image')
    const cardGoodBrand = document.querySelector('.card-good__brand')
    const cardGoodTitle = document.querySelector('.card-good__title')
    const cardGoodPrice = document.querySelector('.card-good__price')
    const cardGoodColor = document.querySelector('.card-good__color')
    const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper')
    const cardGoodColorList = document.querySelector('.card-good__color-list')
    const cardGoodSizes = document.querySelector('.card-good__sizes')
    const cardGoodSizesList = document.querySelector('.card-good__sizes-list')
    const cardGoodBuy = document.querySelector('.card-good__buy')

    
    const generateList = data => data.reduce((html, item, i) => 
        html + `<li class="card-good__select-item" data-id="${i}">${item}</li>`, 
    '')

    const renderCardGood = ([{id, brand, name, cost, color, sizes, photo}]) => {
        const data ={brand, name,cost, id}

        cardGoodImage.src = `goods-image/${photo}`
        cardGoodImage.alt = `${brand} ${name}`
        cardGoodBrand.textContent = brand
        cardGoodTitle.textContent = name
        cardGoodPrice.textContent = `${cost} ₽`
        if (color) {
            cardGoodColor.textContent = color[0]
            cardGoodColor.dataset.id = 0
            cardGoodColorList.innerHTML = generateList(color)
        } else {
            cardGoodColor.style.display = 'none'
        }
        if (sizes) { 
            cardGoodSizes.textContent = sizes[0]
            cardGoodSizes.dataset.id = 0
            cardGoodSizesList.innerHTML = generateList(sizes)
        } else {
            cardGoodSizes.style.display = 'none'
        }

        cardGoodBuy.addEventListener('click', () => {
            if (color) data.color = cardGoodColor.textContent
            if (sizes) data.size = cardGoodSizes.textContent

            const cardData = getLocalStorage()
            cardData.push(data)
            setLocalStorage(cardData)
        })
    }

    cardGoodSelectWrapper.forEach(item => {
        item.addEventListener('click', e => {
            const target = e.target

            if (target.closest('.card-good__select')) {
                target.classList.toggle('card-good__select__open')
            }

            if (target.closest('.card-good__select-item')) {
                const cardGoodSelect = item.querySelector('.card-good__select')
                cardGoodSelect.textContent = target.textContent
                cardGoodSelect.dataset.id = target.dataset.id
                cardGoodSelect.classList.remove('card-good__select__open')
            }
        })
    })



    getGoods(renderCardGood, 'id', hash)

} catch (err) {
    console.warn(err)
}