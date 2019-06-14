<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
*{
  margin: 0;
  padding: 0;
}
body{
  /* font-family: Tahoma, Helvetica, Arial,"\5fae\8f6f\96c5\9ed1" ,"\5b8b\4f53",sans-serif;   */
  font-size: 95%;
}
html{
  overflow:-moz-scrollbars-none;
  -ms-overflow-style:none;
}
.cur:hover{
  cursor: pointer;
  opacity: .8;
}
.lengH{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
