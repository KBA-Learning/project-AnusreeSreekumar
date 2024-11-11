
//Sign Up & Login Pages

function showForm(formType) {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const signupTab = document.getElementById('signupTab');
    const loginTab = document.getElementById('loginTab');
    
    if (formType === 'signup') {
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        signupTab.classList.add('border-b-2', 'border-blue-500');
        loginTab.classList.remove('border-b-2', 'border-blue-500');
    } else {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        signupTab.classList.remove('border-b-2', 'border-blue-500');
        loginTab.classList.add('border-b-2', 'border-blue-500');
    }
}

function resetlink(){

        var email = document.getElementById('emailField').value;
        if (email) {
            document.getElementById('message').innerText = "Reset link is sent to the registered email";
        } else {
            document.getElementById('message').innerText = "Please enter your email id.";
        }
}

function removeItem(){

    let rmvitem = document.getElementById('item2');
    rmvitem.remove();
}

// function editProfileBtn(){

//     const profile = document.getElementById('profile');
//     const oldname = document.getElementById('username').value;
//     const oldemail = document.getElementById('email').value

//     enableEditing();

//     function enableEditing() {
//         forEach(field => {
//             field.removeAttribute('readonly');
//             field.classList.add('editable');
//         });
//         saveChangesBtn.style.display = 'inline-block';
//     }

//     function resetFields() {
//         document.getElementById('firstName').value = oldname;
//         document.getElementById('email').value = oldemail;
//     }
    
//     saveChangesBtn.addEventListener('click', () => {
//         // Reset fields to original values after save
//         resetFields();