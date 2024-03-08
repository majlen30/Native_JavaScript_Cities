const dropDownMenu = document.querySelector('#allCities'),
  changeCity = document.querySelector('#changeCity'),
  changePopulation = document.querySelector('#changePopulation'),
  changeButton = document.querySelector('#changeButton'),
  deleteButton = document.querySelector('#deleteButton'),
  newCity = document.querySelector('#newCity'),
  newPopulation = document.querySelector('#newPopulation'),
  newCityButton = document.querySelector('#newCityButton')

createCities()

// ==========================================================================================================
// Tre addeventlisteners för de två fieldseten --------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------
// addEventlistener för att ta bort en stad ------------------------------------
// -----------------------------------------------------------------------------
deleteButton.addEventListener('click', () => {
  deleteCity(dropDownMenu.value)
  document.querySelector('#errorChangeDelete').innerHTML = ''
  changeCity.value = ''
  changePopulation.value = ''
})

// -----------------------------------------------------------------------------
// addEventListener för att ändra en stad --------------------------------------
// -----------------------------------------------------------------------------
changeButton.addEventListener('click', () => {
  const error = document.querySelector('#errorChangeDelete')
  document.querySelector('#errorChangeDelete').innerHTML = ''
  if (changeCity.value !== '' && changePopulation.value === '') {
    patchCity(dropDownMenu.value, changeCity.value, undefined)
  }
  if (changeCity.value === '' && changePopulation.value !== '') {
    if (isNaN(changePopulation.value) === true) {
      errorHandling(undefined, 'string', error)
    } else {
      patchCity(dropDownMenu.value, undefined, changePopulation.value)
    }
  }
  if (changeCity.value !== '' && changePopulation.value !== '') {
    if (isNaN(changePopulation.value) === true) {
      errorHandling(undefined, 'string', error)
    } else {
      patchCity(dropDownMenu.value, changeCity.value, changePopulation.value)
    }
  }
  if (changeCity.value === '' && changePopulation.value === '') {
    errorHandling(undefined, undefined, error)
  }
})

// -----------------------------------------------------------------------------
// addEventListener för att skapa en ny stad -----------------------------------
// -----------------------------------------------------------------------------
newCityButton.addEventListener('click', () => {
  const error = document.querySelector('#errorCreateCity')
  document.querySelector('#errorCreateCity').innerHTML = ''

  errorHandling(newCity, newPopulation, error)

  if (
    newCity.value !== '' &&
    newPopulation.value !== '' &&
    isNaN(newPopulation.value) === false
  ) {
    postNewCity(newCity.value, newPopulation.value)
    newCity.value = ''
    newPopulation.value = ''
  }
})

// ==========================================================================================================
// Funktion för att göra ett POST-anrop ---------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------
function postNewCity(city, population) {
  fetch('https://avancera.app/cities/', {
    body: '{ "name":"' + city + '", "population":' + population + ' }',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }).then(() => {
    document.querySelector('#viewCities').innerHTML = ''
    dropDownMenu.innerHTML = ''
    document.querySelector('#errorCreateCity').innerHTML = ''
    createCities()
  })
}

// ==========================================================================================================
// Funktion för att göra ett DELETE-anrop -------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------
function deleteCity(id) {
  fetch('https://avancera.app/cities/' + id, {
    method: 'DELETE',
  }).then(() => {
    document.querySelector('#viewCities').innerHTML = ''
    dropDownMenu.innerHTML = ''
    createCities()
  })
}

// ==========================================================================================================
// Funktion för att göra ett PATCH-anrop --------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------
function patchCity(id, city, population) {
  if (typeof city === 'undefined' && typeof population !== 'undefined') {
    fetch('https://avancera.app/cities/' + id, {
      body: '{ "population":' + population + ' }',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    }).then(() => {
      document.querySelector('#viewCities').innerHTML = ''
      dropDownMenu.innerHTML = ''
      changePopulation.value = ''
      createCities()
    })
  }
  if (typeof city !== 'undefined' && typeof population === 'undefined') {
    fetch('https://avancera.app/cities/' + id, {
      body: '{ "name":"' + city + '" }',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    }).then(() => {
      document.querySelector('#viewCities').innerHTML = ''
      dropDownMenu.innerHTML = ''
      changeCity.value = ''
      createCities()
    })
  }
  if (typeof city !== 'undefined' && typeof population !== 'undefined') {
    fetch('https://avancera.app/cities/' + id, {
      body: '{ "name":"' + city + '", "population":' + population + ' }',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    }).then(() => {
      document.querySelector('#viewCities').innerHTML = ''
      dropDownMenu.innerHTML = ''
      changeCity.value = ''
      changePopulation.value = ''
      createCities()
    })
  }
}

// ==========================================================================================================
// Funktion för att skapa alla befintliga städer ------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------
function createCities() {
  fetch('https://avancera.app/cities/')
    .then((response) => response.json())
    .then((result) => {
      const main = document.querySelector('#viewCities')

      for (let i = 0; i < result.length; i++) {
        let section = document.createElement('section'),
          h2 = document.createElement('h2'),
          h3 = document.createElement('h3'),
          city = document.createTextNode(result[i].name),
          city2 = document.createTextNode(result[i].name),
          population = document.createTextNode(
            'Befolkning: ' + result[i].population
          ),
          option = document.createElement('option')

        main.appendChild(section)
        section.appendChild(h2)
        section.appendChild(h3)
        h2.appendChild(city)
        h3.appendChild(population)
        dropDownMenu.appendChild(option)
        option.setAttribute('value', result[i].id)
        option.appendChild(city2)
      }
    })
}

// ==========================================================================================================
// Funktion för felhantering av inputs ----------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------
function errorHandling(city, population, element) {
  let ul = document.createElement('ul')
  element.appendChild(ul)
  if (typeof city !== 'undefined' && typeof population !== 'undefined') {
    if (city.value === '') {
      let errorCity = document.createTextNode('Fyll i ett stadsnamn'),
        li = document.createElement('li')

      ul.appendChild(li)
      li.appendChild(errorCity)
    }
    if (population.value === '') {
      let errorPopulation = document.createTextNode(
          'Fyll i en befolkningsmängd'
        ),
        li = document.createElement('li')

      ul.appendChild(li)
      li.appendChild(errorPopulation)
    }
    if (population.value !== '' && isNaN(population.value) === true) {
      let errorPopulation = document.createTextNode(
          'Befolkningsmängden måste skrivas med siffror'
        ),
        li = document.createElement('li')

      ul.appendChild(li)
      li.appendChild(errorPopulation)
    }
  } else {
    if (typeof city === 'undefined' && typeof population === 'undefined') {
      let error = document.createTextNode(
        'Fyll i antingen stad eller befolkningsmängd'
      )
      li = document.createElement('li')

      ul.appendChild(li)
      li.appendChild(error)
    }

    if (isNaN(population) === true && typeof population !== 'undefined') {
      let errorNumber = document.createTextNode(
        'Befolkningsmängden måste skrivas med siffror'
      )
      li = document.createElement('li')

      ul.appendChild(li)
      li.appendChild(errorNumber)
    }
  }
}
