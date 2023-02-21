
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrar');
  const input = form.querySelector('input');
  
  const mainDiv = document.querySelector('.main');
  const ul = document.getElementById('invitedList');
  
  const div = document.createElement('div');
  const filterLabel = document.createElement('label');
  const filterCheckBox = document.createElement('input');


  var varId=1;

    filterLabel.textContent = "Ocultar los que no hayan respondido";
    filterCheckBox.type = 'checkbox';
    div.appendChild(filterLabel);
    div.appendChild(filterCheckBox);
    mainDiv.insertBefore(div, ul);
    filterCheckBox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      const lis = ul.children;
      if(isChecked) {
        for (let i = 0; i < lis.length; i += 1) {
          let li = lis[i];
          if (li.className === 'responded') {
            li.style.display = '';  
          } else {
            li.style.display = 'none';                        
          }
        }
      } else {
        for (let i = 0; i < lis.length; i += 1) {
          let li = lis[i];
          li.style.display = '';
        }                                 
      }
    });

    function createLI(text,confirmo) {
      function createElement(elementName, property, value) {
        const element = document.createElement(elementName);  
        element[property] = value; 
        return element;
      }

      function appendToLI(elementName, property, value) {
        const element = createElement(elementName, property, value);     
        li.appendChild(element); 
        return element;
      }
      const chc= createElement ('input', 'type', 'checkbox')
      const li = document.createElement('li');
      li.setAttribute("id", varId);
      appendToLI('span', 'textContent', text); 
      if(confirmo==true){
        ticConfs(li.id)
      }
      if(chc.isChecked){
        ticConfs(li.id)
      }   
      appendToLI('label', 'textContent', 'Confirmed')
        .appendChild(chc);
      appendToLI('button', 'textContent', 'edit');
      appendToLI('button', 'textContent', 'remove');
      return li;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value;
      invitacion(text);
      input.value = '';
      const li = createLI(text);
      ul.appendChild(li);
    });

    ul.addEventListener('change', (e) => {
      const checkbox = event.target;
      const checked = checkbox.checked;
      const listItem = checkbox.parentNode.parentNode;

      if (checked) {
        listItem.className = 'responded';
      } else {
        listItem.className = '';
      }
    });

    ul.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const button = e.target;
        const li = button.parentNode;
        const ul = li.parentNode;
        const action = button.textContent;
        const nameActions = {
          remove: () => {
            ul.removeChild(li);
            borrarInvitado(li.id)
          },
          edit: () => {
            const span = li.firstElementChild;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            li.insertBefore(input, span);
            li.removeChild(span);
            button.textContent = 'save';  
          },
          save: () => {
            const input = li.firstElementChild;
            const span = document.createElement('span');
            span.textContent = input.value;
            li.insertBefore(span, input);
            li.removeChild(input);
            cambName(li.id,input.value)
            button.textContent = 'edit';        
          }
        };

        // select and run action in button's name
        nameActions[action]();
      }
    });  


    //Mi codigo
    const entryPoint = "http://localhost:3000/invitados";
    var data;

  //request.onload = function() {
  //  const lista = request.response;
  //  let nuevaData = lista.push({"nombre": "Paco de la Lusia"})
  //  for(var i=;i<lista.length;i++){
  //    var li = createLI(lista[i].nombre);
  //    ul.appendChild(li);
  //  }
  //}
  async function invitados  (){
    return new Promise((resolve, reject) => {
      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", entryPoint, true);
      xhttp.send();
      xhttp.onload = () =>{
        if(xhttp.status >= 200 && xhttp.status < 300){
          resolve(xhttp.response)
        }else{
          reject(xhttp.statusText)
        }
      }
    });
  }
  var promesa=invitados();
  promesa.then(responseData => {
    lista=JSON.parse(responseData);
    lista.forEach(user=>{
      const per = createLI(user.nombre,user.confirmado);
      ul.appendChild(per);
      varId=varId+1;
    })
    varId=varId-1;
  }).catch(error=>{
    console.log(error);
  })

  async function invitacion(newName){
    varId=varId+1;
    var user=JSON.stringify({
      id:varId,
      nombre: newName,
      confirmado: false
    })
    sendData('Post',null,user)
  }
  async function cambName(id,newName){
    var user=JSON.stringify({
      id:id,
      nombre: newName
    })
    sendData('Patch',id,user)
  }
  async function borrarInvitado(id){
    sendData('Delete',id,'')
  }
  async function ticConfs(id){
    var user=JSON.stringify({
      id: id,
      confirmado: true
    })
    sendData('Patch',id,user)
  }
  async function sendData(requestType, id, newData) {
    var aux = new XMLHttpRequest();
    aux.open(requestType, (id == null ? entryPoint : entryPoint + '/' + id), true);
    aux.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    aux.send(newData);
  }
    //Final mi codigo 
});  
