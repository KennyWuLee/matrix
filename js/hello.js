$(document).ready(function() {
	var w, h;
	$('#rref').hide();
	$('#log').hide();
	$('#dimensions').submit(function() {
		w = $('#dimensions #w').val();
		h = $('#dimensions #h').val();
		if(w && h && w > 0 && h > 0) {
			fillTable(w, h);
			$('#rref').show();
		}
		return false;
	});
	$('#rref').click(function() {
		$('#log').show();
		rref($('#table tbody'), h , w);
	});
});

function fillTable(w, h) {
	var $table = $('#table tbody');
	$table.empty();
	for(i = 0; i < h; i++) {
		var $row = $('<tr></tr>');
		for(j = 0; j < w; j++)
			$row.append($('<td></td>').append('<input type="number">').attr('id', i+':'+j));
		$table.append($row);
	}
}

function rref($table, height, width) {
	var currCol = 0;
	var currRow = 0;

	while(currCol < width) {
		var i = currRow;
		//move row with leading 1 up
		var value;
		while(i < height && (value = valueAt($table, i, currCol)) == 0)
			++i;
		if(i < height) {
			switchRows($table, currRow, i);
			multiByScalar($table, currRow, 1 / value);
			//clear rest of colum
			for(j = 0; j < height; ++j)
				if(j != currRow)	
					addToRow($table, currRow, j, -1 * valueAt($table, j, currCol));
			currRow++;
			currCol++;
		}	
		else
			currCol++;
	}
}

function valueAt($table, row, col) {
	return $table.find("tr:eq(" + row + ") td:eq(" + col +") input").val();
}

function multiByScalar($table, row, factor) {
	if(factor != 1) {
		log("R" + row + " -> " + factor + " * R" + row);
		var $row = $table.find("tr:eq(" + row + ")");
		$row.find('input').each(function() {
			$this = $(this);
			var v = $this.val();
			$this.val(v * factor);
		});
	}
}


function switchRows($table, row1, row2) {
	if(row1 != row2) {
		log("R" + row1 + " <-> R" + row2);
		var $row1 = $table.find("tr:eq(" + Math.min(row1, row2) + ")");
		var $row2 = $table.find("tr:eq(" + Math.max(row1, row2) + ")");

		$row1.after($row2.clone());
		$row2.after($row1);
		$row2.remove();
	}
}

function addToRow($table, row1, row2, factor) {
	log("R" + row2 + " -> R" + row2 + " + " + factor + " * R" + row1);
	var $row1 = $table.find("tr:eq(" + row1 + ")");
	var $row2 = $table.find("tr:eq(" + row2 + ")");

	var values1 = [];
	var i = 0;
	$row1.find('input').each(function() {
		values1[i++] = $(this).val();
	});

	i = 0;
	$row2.find('input').each(function() {
		$this = $(this);
		var v = $this.val();
		$this.val(parseFloat(v) + parseFloat(factor * values1[i++]));
	});
}

function log(message) {
	$('#log').text(function() {
		return $(this).text() + message + '\n';
	});
}
