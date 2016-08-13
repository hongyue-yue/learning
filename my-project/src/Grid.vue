<template>
			<table id="grid">
				<thead>
					<tr>
						<th v-for="col in columns">
							{{ col.name | capitalize}}
						</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(index,entry) in dataList">
						<td v-for="col in columns">
							{{ entry[col.name] }}
						</td>
						<td>
							<button>delete</button>
						</td>
					</tr>
				</tbody>
			</table>
</template>
<script>
export default{
     data:function(){
        return{
        columns: [{
                      name: 'customerId',
                  }, {
                      name: 'companyName'
                  }, {
                      name: 'contactName'
                  }, {
                      name: 'phone'
                  }],
        dataList:[
                   	{
				   		customerId:'0',
						companyName:'qaz',
						contactName:'edc',
                   		phone:'111-234-456'
					},
					{
					    customerId:'1',
					    companyName:'wsx',
					    contactName:'rfv',
					    phone:'112-245-123'
					}
                  ]
        }
     }
}
</script>
<style>
table,
td,
th {
	border-collapse: collapse;
	border-spacing: 0
}

table {
	width: 100%;
}

td,
th {
	border: 1px solid #bcbcbc;
	padding: 5px 10px;
}

th {
	padding: 10px;
	font-weight: 400;
	color: #fff;
	background: #0090d3;
	cursor: pointer;
}

tr:nth-of-type(odd) {
	background: #fff
}

tr:nth-of-type(even) {
	background: #eee
}
</style>
