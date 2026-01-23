h1. Observations
h2. Security

"Only authorized users are permitted to access the books catalog and make changes. Both the login and books form pages include validation measures."

Authorisation is enforced in the UI routing layer only. Data is stored client-side in localStorage (books-data), so it is not protected against tampering and is not shared across users/devices.


 * Access Control is UI-only
  - Login is not neccessary - pages can be accessed by deeplinking (eg https://frontendui-librarysystem.onrender.com/books)

 - No CRUD actions are prohibited if user is not logged in


"When the logout button is clicked, users are returned to the login page."

* User is returned to the List Books page. No restrictions are enforced


