const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => { //destructuring 
    
    //using bulma.css classes in their respective dynamic elements
    root.innerHTML = `
    <label><b>Search</b></label>
     <input class="input"></input>
     <div class="dropdown"> 
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>  
        </div>
     </div>
`
    
    //root.querySelector() becoz we now doing everthing inside 'root'
    const Input = root.querySelector('input'); // <input class="input"></input> is for this input.
    const dropdownMenu = root.querySelector('.dropdown');  //<div class="dropdown"> is for this dropdownMenu
    const resultsWrapper = root.querySelector(".results"); //<div class="dropdown-content results"> is for this resultsWrapper.

    const onInputChange = async event => {
        //using await before fetchData() as it is an async fucntion
        const items = await fetchData(event.target.value); //event.target.value -gives value entered in input box

        if (items.length < 1) {
            dropdownMenu.classList.remove("is-active")
            return;
        }

        resultsWrapper.innerHTML = ''; // to empty the last searched items list to populate the new list

        //changing class of an element to make dropdown visible using "is-active" in bulma
        dropdownMenu.classList.add("is-active")

        items.forEach(item => {
            //creating 'option' for each item so as a result u ll get more options to select one
            const option = document.createElement('a');           
            option.classList.add('dropdown-item'); //bulma class
            option.innerHTML = renderOption(item); //renderOption is a func defined in index.js

            //once a item is clicked from the list
            option.addEventListener('click', () => {
                dropdownMenu.classList.remove("is-active")
                Input.value = inputValue(item) //func defined jst to extract the input value
                onOptionSelect(item); //calling 2nd API to get selected item details
            })
            resultsWrapper.append(option);
        });
    };
    Input.addEventListener('input', debounce(onInputChange, 800));

    document.addEventListener('click', (event) => {    //event always bubble in js
        console.log(event.target) // event.target says what get clicked ..say which element is clicked
        //When user click somewhere apart from dynamically created elements (if 'root' doesn't contain clicked event), then close the item list
        if (!root.contains(event.target)) {
            dropdownMenu.classList.remove("is-active")  //to close dropdown
        }
    })
}