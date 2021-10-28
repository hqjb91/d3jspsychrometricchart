function psychCalc(){  

    let t = parseFloat(document.getElementById("drybulb").value);  
            
    if (t_wb=parseFloat(document.getElementById("wetbulb").value)){
            p = 101325;
            p_ws_wb=saturation_pressure(t_wb);
            ws_wb=humidity_ratio(p_ws_wb,p);
            w=equation_35(t_wb,ws_wb,t);
            p_ws=saturation_pressure(t);
            ws=humidity_ratio(p_ws,p);
            mew=degree_saturation(w,ws); 
            rh=rel_humidity(mew,p_ws,p);
            v=specific_volume(t,w,p);
            h=enthalpy(w,t);
            p_w=equation_36(p,w);
            t_d=dewpoint(p_w);
            rho=density(v,w);  
        }
    
    else if (rh = parseFloat(document.getElementById("relhumidity").value)){
            p = 101325;
            p_ws=saturation_pressure(t);
            p_w=p_ws*rh/100.0;
            w = humidity_ratio(p_w,p);
            ws = humidity_ratio(p_ws,p);
            mew=degree_saturation(w,ws); 
            v=specific_volume(t,w,p);
            h=enthalpy(w,t);
            t_d=dewpoint(p_w);
            rho=density(v,w);  
            t_wb=calcwetbulb(t,p,w);
        }
        
    else if (t_d=parseFloat(document.getElementById("dewpoint").value)){
            p = 101325;
            p_w=saturation_pressure(t_d);
            w = humidity_ratio(p_w,p);
            p_ws=saturation_pressure(t);     
            ws = humidity_ratio(p_ws,p);     
            mew=degree_saturation(w,ws); 
            rh=rel_humidity(mew,p_ws,p);
            v=specific_volume(t,w,p);
            h=enthalpy(w,t);
            rho=density(v,w);  
            t_wb=calcwetbulb(t,p,w);
        }

    else if (w=parseFloat(document.getElementById("humratio").value)){
            p = 101325;
            p_ws=saturation_pressure(t);
            ws = humidity_ratio(p_ws,p);
            mew=degree_saturation(w,ws); 
            rh=rel_humidity(mew,p_ws,p);
            v=specific_volume(t,w,p);
            h=enthalpy(w,t);
            rho=density(v,w);  
            t_wb=calcwetbulb(t,p,w);
            p_w=p_ws*rh/100.0;
            t_d=dewpoint(p_w);   
        }
    
    else{
            alert("Please enter another parameter besides Dry Bulb Temperature");
            return;
        }    

    //Round to decimal places
    document.getElementById("drybulb").value = Math.round(t*10)/10;    
    document.getElementById("wetbulb").value = Math.round(t_wb*10)/10; 
    document.getElementById("relhumidity").value = Math.round(rh); 
    document.getElementById("dewpoint").value = Math.round(t_d*10)/10; 
    document.getElementById("humratio").value = Math.round(w*1000000)/1000000; 
                
    document.getElementById("enthalpy").value = Math.round(h*100)/100; 
    document.getElementById("density").value = Math.round(rho*100)/100; 
    document.getElementById("specvol").value = Math.round(v*1000)/1000; 
    document.getElementById("pvp").value = Math.round(p_w);
    document.getElementById("svp").value = Math.round(p_ws); 

    plotPoint(Math.round(t*10)/10,Math.round(w*10000)/10);

    return;
}

function setWetBulb()
{
    document.getElementById("relhumidity").value = "";
    document.getElementById("dewpoint").value = "";
    document.getElementById("humratio").value = "";
    psychCalc();
    return;
}

function setRelHumidity()
{
    document.getElementById("wetbulb").value = "";
    document.getElementById("dewpoint").value = "";
    document.getElementById("humratio").value = "";
    psychCalc();
    return;
}
function setDewPoint()
{
    document.getElementById("relhumidity").value = "";
    document.getElementById("wetbulb").value = "";
    document.getElementById("humratio").value = "";
    psychCalc();
    return;
}

function setHumRatio()
{
    document.getElementById("relhumidity").value = "";
    document.getElementById("wetbulb").value = "";
    document.getElementById("dewpoint").value = "";
    psychCalc();
    return;
}

function saturation_pressure(t){
    const c1 = -5.6745359e3;
    const c2 = 6.3925247e0;
    const c3 = -9.677843e-3;
    const c4 = 6.2215701e-7;
    const c5 = 2.0747825e-9;
    const c6 = -9.484024e-13;
    const c7 = 4.1635019e0;

    const c8=-5.8002206e3;
    const c9=1.3914993;
    const c10=-4.8640239e-2;
    const c11=4.1764768e-5;
    const c12=-1.4452093e-8;
    const c13=6.5459673;

    if (t>0){
        t=t+273.15;
        pressure=Math.exp(c8/t+c9+c10*t+c11*t*t+c12*t*t*t+c13*Math.log(t));
    }
    else{ 
        t=t+273.15;
        pressure=Math.exp(c1/t+c2+c3*t+c4*t*t+c5*t*t*t+c6*t*t*t*t+c7*Math.log(t)); 
    }    
    return(pressure);
}

function humidity_ratio(p_w,p){
    hum = 0.62198*p_w/(p-p_w);
    return(hum);
}

function equation_35(t_wb,ws_wb,t){
    w=((2501-2.381*t_wb)*ws_wb - 1.006*(t-t_wb))/(2501+1.805*t-4.186*t_wb);
    return(w);
}


function degree_saturation(w,ws){
    return(w/ws);
}

function rel_humidity(mew,p_ws,p){
    thi=mew/(1.0-(1.0-mew)*(p_ws/p));
    return(thi*100);
}

function specific_volume(t,w,p){
    v = 287.1*(t+273.15)*(1+1.6078*w)/p;

    return(v);
}

function enthalpy(w,t){
    h=1.006*t + w*(2501+1.805*t);
    return(h);
}

function equation_36(p,w){
    pressure=p*w/(0.62198+w);
    return(pressure);
}

function dewpoint(p_w){
    p_w=p_w/1000.0;
    a = Math.log(p_w);
    c14=6.54;
    c15=14.526;
    c16=0.7389;
    c17=0.09486;
    c18=0.4569;

    dew= c14+c15*a+c16*a*a+c17*a*a*a+c18*Math.pow(p_w,0.1984);
    if (dew < 0)
    dew = 6.09 + 12.608*a + 0.4959*a*a;

    return(dew);
}

function density(v,w){
    dens=(1.0/v)*(1.0+w);
    return(dens);
}

function calcwetbulb(t,p,w){
    t_wb=t;
    count=1;
    error=1.0;
    while ((count < 10000)&&(error > 0.001)){
        p_ws_wb=saturation_pressure(t_wb);
        ws_wb=humidity_ratio(p_ws_wb,p);
        test=(2501*(ws_wb-w)-t*(1.006+1.805*w))/(2.381*ws_wb-1.006-4.186*w);
        error = t_wb-test;
        t_wb = t_wb - error/100;
        count = count+1;
    }
    if (count > 9999) alert ("calculation error for wet bulb temperature");
    return (t_wb);
}

//Function to plot points
function plotPoint(dbt,humidityratio){

    const svg = d3.select("#psychro")
    .select("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top +")");
    
    const xscale = d3.scaleLinear()
        .range([0,width])
        .domain([0,50]);

    const yscale = d3.scaleLinear()
            .range([height,0])
            .domain([0,30]);


    svg.selectAll("dot")
    .data([{x:dbt,y:humidityratio}])
    .enter()
    .append("circle")
    .attr("cx", function(d) {return xscale(d.x);})
    .attr("cy", function(d) {return yscale(d.y);})
    .attr("r", 3)
    .style("fill", "magenta");  
    
}

function clearCalc(){
    document.getElementById("drybulb").value = "";    
    document.getElementById("wetbulb").value = "";  
    document.getElementById("relhumidity").value = "";  
    document.getElementById("dewpoint").value = "";  
    document.getElementById("humratio").value = "";
                
    document.getElementById("enthalpy").value = "";  
    document.getElementById("density").value = "";     
    document.getElementById("specvol").value = "";  
    document.getElementById("pvp").value = "";  
    document.getElementById("svp").value = "";  
}