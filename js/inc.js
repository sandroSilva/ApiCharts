$(document).ready(function(){

    $.jqplot.config.enablePlugins = true;
    var urlJson = "json/access.json";

    var totalAccess = 0;
    var makeAccess=[];
    var ano;
    var mes;
    var dia;
    var date=[];
	
	var startMonth = 0;
	var endMonth = 0;
    
   	$.ajax({
	    type: 'GET',
	    url: urlJson,
	    dataType: "json",
	    success: function(data){
			for (var i=0; i < data.length; i++)
				{
					//seleciona e quebra parte da data para formatar para o melhor entendimento da API
					dateTimeR = data[i].date;
					ano = dateTimeR.slice(0,4);
					mes = dateTimeR.slice(8,10);
					dia = dateTimeR.slice(5,7);
					hora = dateTimeR.slice(11,13);
					date = ano+"-"+mes+"-"+dia;
					//monta o array responável para gerar os dados para a API montar o gráfico
					makeAccess.push(eval("['"+date+"',"+data[i].acess+"]"));
					//soma os dados para a contagem geral dos acessos
					totalAccess = parseInt(totalAccess)+parseInt(data[i].acess);
					//soma os dias do mês por período de quinze dias através de um IF inline
					dia >= 15 ? endMonth = parseInt(endMonth)+parseInt(data[i].acess) : startMonth = parseInt(startMonth)+parseInt(data[i].acess) ;
				}
			//imprime o total de acessos
			$("#totaldeacessos").replaceWith('<div id="totaldeacessos" class="dadoTituloAnalytics pull-left">'+totalAccess+' acessos</div>');
			
			
			/* Gráfico de Acessos */
		    var jqAccess = $.jqplot('acessos', [makeAccess], {
			    axes:{
				xaxis:{
				    renderer:$.jqplot.DateAxisRenderer, 
				    rendererOptions:{
						tickRenderer:$.jqplot.CanvasAxisTickRenderer,
						//formato da data no gráfico (eixo X)
						tickOptions:{formatString:'%d/%m/%y'}
						},
						tickInterval: "15 days",
						tickOptions:{ 
						fontSize:'12px', 
						fontFamily:'Tahoma', 
						angle:0
						}
					},
				yaxis:{
				    rendererOptions:{
					tickRenderer:$.jqplot.CanvasAxisTickRenderer},
					//configurações das legendas no eixo Y
					tickOptions:{
					    fontSize:'12px', 
					    fontFamily:'Tahoma', 
					    angle:0
					}
				}
			    },
				//configurações da linhas das séries do gráfico
			    series:[
				    { 
						lineWidth:3, 
						markerOptions:{ style:'filledCircle'},
						color:'#5FAB78'
				    }
				    ],
				//configurações do cursor
			    cursor:{
				showTooltip: true,
				zoom:true,
				looseZoom: true,
				style: 'default'
			    }
			});
			//botão para resetar o chart, note que é o mesmo nome da variável
			$("#resetZoom").click(function() {
				   jqAccess.resetZoom();
				   });			
			/* Fim Gráfico de Acessos */
			
			/* Início Gráfico de total de Acessos no início e final do mês */
		    var jpMonth = $.jqplot('month', [[[' &nbsp;Início do Mês',startMonth],[' &nbsp;Final do Mês',endMonth]]], {
				//configurações  
			  	gridPadding: {top:0, bottom:38, left:0, right:0},
			  	//configurações  
			 	 grid: {
				   drawBorder: false, 
				   drawGridlines: false,
				   background: '#ffffff',
				   shadow:false
			  	},
				//configurações  
				seriesDefaults:{
					renderer:$.jqplot.PieRenderer, 
					trendline:{ show:false }, 
					rendererOptions: { padding: 8, showDataLabels: true},
				 },
			  	//configurações das legendas do gráfico
				legend:{
					location: 'e',
					show:true, 
					marginTop: '15px'
				},
			  	//configurações do cursor
				cursor:{
					showTooltip: false,
					style: 'default'
				}
		      });
			/* Fim Gráfico de total de Acessos no início e final do mês */
		}
	});
});
  