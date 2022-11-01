# Crear un flujo de slide

  

## 1. Slides

![enter image description here](https://i.postimg.cc/SRjpHxvL/slide.png)
1. Debe crear un componente slide, darle un identificador unico en la propiedad id que sera usado en JS.
2. El slide debe tener un titulo en el H2.
3. Dentro del body van cada una de las pantallas del slide deben crearse como un div con las clases sl y hide, y debe tener un data-title para el titulo en el header
4. El contenido de la pantalla debe ponerse dentro el div
5. Para poner una opcion que lleve a otro slide debe crear un elemento con el atributo data-slide-selector, este atributo debe tener el id unico del slide al cual debe ir al hacer clic.
6. En el div controls se encuentran los controles del menu de la parte de abajo, por lo general estos no cambian, si quiere que el botón con el icono de la casa lo lleve a un slide especifico debe setearle la propiedad data-slide-selector con el id unico del slide.

## Modal
![enter image description here](https://i.postimg.cc/YqKx0spk/modal.png)

Para tener un popup que renderize contenido debe definir un modal en el codigo html, debajo de la etiqueta para cerrar el modal puede poner los distintos contenidos que puede renderizar el modal. Cada contenido debe tener un id unico.

![enter image description here](https://i.postimg.cc/MT0pDHj9/modal2.png)
Para abrir el modal y cargar contenido solamente ponga en un elemento html la propiedad data-modal con el id único del contenido que quiere cargar