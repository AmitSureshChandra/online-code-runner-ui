<template>
  <div class="container">
    <div class="editor-container">
      <select v-model="language" class="language-select">
        <option v-for="(item, index) in compilers" :key="index" :value="index">{{item}}</option>
      </select>
      <textarea v-model="code" class="editor" placeholder="Type your code here"></textarea>
      <button @click="runCode" :disabled="loading" class="run-button">Run Code</button>
    </div>
    <div class="input-container">
      <label class="input-label">Input:</label>
      <textarea v-model="input" class="input" placeholder="Type your input here"></textarea>
    </div>
    <div class="output-container">
      <label class="output-label">Output:</label>
      <pre class="output">{{ output }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "App",
  data() {
    return {
      language: "jdk8",
      code: `class Solution  {
   public static void main(String[] args) {
       System.out.println("Hello World");
   }
}`,
      input: "",
      output: "",
      loading: false,
      compilers : {
        
      }
    };
  },
  mounted(){
    this.loadCompilers()
  },  
  methods: {
    loadCompilers() {
      this.loading = true
      axios.get("/api/v1/run/compilers").then(({data}) => {
        this.compilers = data
        console.log(data);
      }).catch(e => {
        console.log({e});
      })
      .finally(() => {
        this.loading = false
      })
    },
    runCode() {
      // make a api call & then set output
      this.loading = true
      axios.post("/api/v1/run", {
        compiler: this.language,
        code: this.code,
        input: this.input
      }).then(({data}) => {
        this.output = data.output
        if(data.exitCode != 0) {
          this.output = data.error
        }
      }).catch(e => {
        console.log({e});
      })
      .finally(() => {
        this.loading = false
      })
    },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.editor-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.language-select {
  font-size: 16px;
  margin-bottom: 10px;
}

.editor {
  width: 100%;
  height: 200px;
  font-size: 14px;
  padding: 10px;
  border: 1px solid #ccc;
  resize: none;
}

.run-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.input-label {
  font-size: 18px;
  margin-bottom: 5px;
}

.input {
  width: 400px;
  height: 100px;
  font-size: 14px;
  padding: 10px;
  border: 1px solid #ccc;
  resize: none;
}

.output-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.output-label {
  font-size: 18px;
  margin-bottom: 5px;
}

.output {
  width: 400px;
  max-height: 200px;
  font-size: 14px;
  padding: 10px;
  border: 1px solid #ccc;
  overflow-y: auto;
  white-space: pre-wrap;
}
</style>