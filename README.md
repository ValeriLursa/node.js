<h1>Node.js</h1>
<h2>Pet-проект на основе курса https://metanit.com/web/nodejs/</h2>
Имитация квартиры в виде сайта<br>
<a href="https://www.figma.com/proto/N88bYyWe5NhWS5Sx8kyxMh/Home?node-id=3%3A70&scaling=min-zoom&page-id=0%3A1&starting-point-node-id=1%3A2">Ссылка на макет в Figma</a><br>
Используемые технологии: 
<ul>
<li>html,</li>
<li>css,</li>
<li>js</br>
<ul> <li>
node.js</br>
<ul>
<li>express,</li>
<li>handlebars,</li>
<li>fs,</li>
<li>тестирование: Mocha (supertest),</li>
<li>assert</li>
</ul>
</li>
</ul>
</li>
</ul>
<h2>Menu</h2>
<ul>
<li><a href="https://github.com/ValeriLursa/node.js/blob/master/README.md#api-%D0%B4%D0%BB%D1%8F-%D0%B2%D0%B7%D0%B0%D0%B8%D0%BC%D0%BE%D0%B4%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D1%8F-%D1%81-%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D0%B5%D0%BC">Api для взаимодействия с пользователем</a></li>
<li><a href="https://github.com/ValeriLursa/node.js/blob/master/README.md#%D0%BC%D0%BE%D0%B4%D1%83%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5-%D1%82%D0%B5%D1%81%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D1%81-%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D1%8C%D1%8E-mocha">Модульное тестирование</a></li>
</ul>

<h2>API для взаимодействия с пользователем</h2>
<h3 align="center">--get-запрос--</h3>
Прямой get-запрос к серверу <img src="img/api.books/get.png" alt="get request image"/>
Get-запрос с id=1 к серверу <img src="img/api.books/get_1.png" alt="get request id = 1 image"/>
Get-запрос с id=4 к серверу <img src="img/api.books/get_4.png" alt="get request id = 4 image"/>
Get-запрос через форму <img src="/img/api.books/get_form.png" alt="get request on the form image"/>

<h3 align="center">--put-запрос--</h3>
Форма до изменений <img src="img/api.books/put1.png" alt="before put request image"/>
Форма после изменений <img src="img/api.books/put2.png" alt="after put request image"/>

<h3 align="center">--delete-запрос--</h3>
Форма до удаления <img src="img/api.books/delete1.png" alt="before delete request image"/>
Форма после удаления <img src="img/api.books/delete2.png" alt="before delete request image"/>
Файл json после удаления <img src="img/api.books/delete.fileJson.png" alt="delete request json-file image"/>

<h3 align="center">--post-запрос--</h3>
Форма до добавления <img src="img/api.books/post1.png" alt="before post request image"/>
Форма после добавления <img src="img/api.books/post2.png" alt="before post request image"/>
Файл json в виде массива после добавления <img src="img/api.books/post.fileJson.png" alt="post request json-file image"/>

<a href="https://github.com/ValeriLursa/node.js/blob/master/README.md#">Назад</a>

<h2>Модульное тестирование с помощью Mocha</h2>
file html tests - тестирование возвращения файла с расширением html с сервера</br>
file css test - тестирование возвращения файла с расширением css с сервера</br>
api books Tests - тестирование api.books</br>
<img src="img/testMucha/testApp.png" alt="unit testing image"/>
<a href="https://github.com/ValeriLursa/node.js/blob/master/README.md#">Назад</a>
