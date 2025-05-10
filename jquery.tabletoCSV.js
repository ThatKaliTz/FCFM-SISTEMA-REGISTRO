jQuery.fn.tableToCSV = function() {
    
    var clean_title = function (text) {
        text = text.replace(/"/g, '""');
        text = text.replace(/\s/g, '');
        text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        return '"'+text+'"';
    };
    
	  var clean_text = function (text) {
        text = text.replace(/"/g, '""');
        // text = text.replace(/\s/g, '');
        // text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        return '"'+text+'"';
    };
    
	$(this).each(function(){
      var table = $(this);
      var caption = $(this).find('caption').text();
      var title = [];
      var rows = [];
      var delimitador = ',';
      $(this).find('tr').each(function(){
          var data = [];
          $(this).find('th').each(function(){
              var text = clean_title($(this).text());
              title.push(text);
          });
          $(this).find('td').each(function(){
              var td = $(this);
              var text = '';
              if (td[0].childNodes[0].nodeType !== 3) {
                  text = clean_text($(this)[0].childNodes[0].value);
              } else {
                  text = clean_text($(this).text());
              }
              data.push(text);
          });
          data = data.join(delimitador);
          rows.push(data);
      });
      title = title.join(delimitador);
      rows = rows.join("\n");
      var csv = title + rows;
      var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
      var download_link = document.createElement('a');
      download_link.href = uri;
      var ts = "Rep_" + new Date().toLocaleDateString();
      if(caption==""){
          download_link.download = ts+".csv";
      } else {
          download_link.download = caption+"-"+ts+".csv";
      }
      document.body.appendChild(download_link);
      download_link.click();
      document.body.removeChild(download_link);
	});
};

