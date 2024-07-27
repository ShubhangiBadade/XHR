const cl = console.log;

const BASE_URL = `https://jsonplaceholder.typicode.com`;
const POST_URL = `${BASE_URL}/posts`;
//const EDIT_URL = `${BASE_URL}/POSTS/:editId`;
//const SINGLE_POST_URL = '${BASE_URL}/posts/:id';// methods used : get , post , put/patch , delete

const postContainer = document.getElementById("postContainer");
const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content");
const userIdControl = document.getElementById("userId");
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');
const loader = document.getElementById('loader');

let postArr = [];
// Templating function to display data on UI.
const templating = (arr) => {
    let result = ``;
    //  post is object we received from backend data.
    //post.id >> backend will provide the id.
    arr.forEach(post => {
        result += `
                    <div class="col-md-4 mb-3">
                        <div class="card list-Card postCard h-100" id='${post.id}'>
                            <div class="card-header">
                            <h3 class="m-0"> ${post.title} </h3>
                            </div>
                            <div class="card-body">
                                <p class="m-0">
                                ${post.body}
                                </p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button onclick = "onEdit(this)" class="btn-btn-outline-primary btn-sm">Edit</button>
                                <button onclick = "onDelete(this)"class="btn btn-outline-primary btn-sm">Remove</button>
                            </div>
                        </div>
                    </div>

        
        `
    });
    postContainer.innerHTML = result;
}


const fetchPost = () => {
    // 1. Creation of XHR object by new constructor
    let xhr = new XMLHttpRequest();
    // 2. Configuration
    xhr.open("GET", POST_URL, true);

    // 4. response received
    xhr.onload = function () {
        //cl(xhr.response);
        cl(xhr.status);
        //cl(xhr.statusText);
        if (xhr.status >= 200 && xhr.status < 300) {
            // after api call sucess
            postArr = JSON.parse(xhr.response)
            cl(postArr);
            //data recd. so do the templating of data
            templating(postArr); // function call.
        }
    }
    // 3. resquest sent
    xhr.send();
}
fetchPost();

const onEdit =(ele)=>{
    //cl(ele);
    let editId = ele.closest('.card').id;
    localStorage.setItem("editId",editId);
    cl(editId);

    let EDIT_URL =`${BASE_URL}/posts/${editId}`;
    //API CALL
    let xhr = new XMLHttpRequest();

    xhr.open("GET",EDIT_URL);

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
           cl(xhr.response);
           let post = JSON.parse(xhr.response);  // post is the object to be edited
           titleControl.value = post.title;
           contentControl.value = post.body;
           userIdControl.value = post.userId;
           updateBtn.classList.remove('d-none');
           submitBtn.classList.add('d-none')
        }
    }
    xhr.send()

}

const onDelete =(ele)=>{
    let removeId = ele.closest('.card').id;
    //cl(removeId);
    //URL for API call
    let REMOVE_URL = `${BASE_URL}/POSTS/${removeId}`;
    //let getConfirm = confirm()

    // API CALL
    // loader show
    loader.classList.remove('d-none');
    let xhr = new XMLHttpRequest();

    xhr.open('DELETE', REMOVE_URL);

    xhr.onload = function(){
        var postDelete = confirm("Confirm to delete?");
        if(xhr.status >= 200 && xhr.status < 300){
           ele.closest('.col-md-4').remove();

        }

        loader.classList.add('d-none');
    }

    xhr.send();
}


const onPostUpdate = ()=>{
    //updated object
    let updatedObj = {
        title : titleControl.value,
        body : contentControl.value.trim(),
        userId : userIdControl.value
    }
    cl(updatedObj);
    let updateId = localStorage.getItem('editId');

    let UPDATE_URL = `${BASE_URL}/posts/${updateId}`
    // APIcall to update post DB. >> show loader
    loader.classList.remove('d-none');
    let xhr = new XMLHttpRequest();
    xhr.open("PATCH",UPDATE_URL);

    xhr.onload = function(){
        if (xhr.status >= 200 && xhr.status < 300){
            cl(xhr.response);
            let card = [...document.getElementById(updateId).children];
             // this is edited card , which will go on ui with updated changes.
            cl(card);
            card[0].innerHTML = `<h3 class="m-0">${updatedObj.title}</h3>`;
            card[1].innerHTML = `<h3 class="m-0">${updatedObj.body}</h3>`;
            postForm.reset();
            updateBtn.classList.add('d-none');
            submitBtn.classList.remove('d-none');
        }

        // after getting response from db >> hide loader.
        loader.classList.add('d-none');

    }
    xhr.send(JSON.stringify(updatedObj));
}


const onPostSubmit = (eve) => {
    eve.preventDefault();
    // Get new post object from Form.
    let newPost = {
        title: titleControl.value,
        body: contentControl.value.trim(),
        userId: userIdControl.value,
    }
    cl(newPost);

    let xhr = new XMLHttpRequest();

    xhr.open("POST", POST_URL)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            cl(xhr.response)
            newPost.id = JSON.parse(xhr.response).id;

            let div = document.createElement('div');
            div.className = 'col-md-4 mb-3';
            div.innerHTML = `
                            <div class="card postCard h-100" id='${newPost.id}'>
                            <div class="card-header">
                            <h3 class="m-0"> ${newPost.title} </h3>
                            </div>
                            <div class="card-body">
                                <p class="m-0">
                                ${newPost.body}
                                </p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button onclick = "onEdit(this)" class="btn-btn-outline-primary btn-sm">Edit</button>
                                <button onclick = "onDelete(this)"class="btn btn-outline-primary btn-sm">Remove</button>
                            </div>
                        </div>
            
                            `

            postContainer.prepend(div);
        }
    }

    xhr.send(JSON.stringify(newPost)) //bodymsg
}

postForm.addEventListener('submit', onPostSubmit);
updateBtn.addEventListener('click',onPostUpdate);