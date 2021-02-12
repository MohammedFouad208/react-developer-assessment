import { createServer } from 'miragejs';

import data from './data.json';

createServer({
  routes() {
    this.namespace = 'api';

    this.get('/posts', () => {
      return data;
    });
    
    this.get('/Categories', () =>{
      var Categories = [];
      var id = 1;
      data.posts.forEach(element => {
        element.categories.forEach(item => {
          if(Categories.length < 0){
            Categories.push( {name:item.name, id:id});
            id++;
          }
          else
          {
            var cat = Categories.find(val=> val.name == item.name);
            if(cat == undefined)
            Categories.push({name:item.name, id:id});
            id++;
          }
          
        });

      });
      return Categories;
    });
  },
});
