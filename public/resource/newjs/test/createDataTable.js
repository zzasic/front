// init event
$(document).ready(function(){
    dataTableTesting();
});
function dataTableTesting(){
    var dataTb = $("#dataTb").DataTable({
        "dom": '<"top"li>t<"bottom"p>',
        // <"top" elements> <"bottom" elements> <"clear" elements>
        //ex :: filter // length // info // paging // table

        "order": [[2,"asc"]],
        "columnDefs": [
            { "orderable": true,
              "targets": [1]
            }
         ],
         "iDisplayLength": 10,
         "language": {
                "decimal":        "",
                "emptyTable":     "No data available in table",
                "info":           "건 / 페이지 (총 "+"<em>"+"_TOTAL_"+"</em>"+"건 / "+"<em>"+"_PAGE_"+"</em>"+"페이지)",
                "infoEmpty":      "건 / 페이지 (총 "+"<em>"+"_TOTAL_"+"</em>"+"건 / "+"<em>"+"_PAGE_"+"</em>"+"페이지)",
                "infoFiltered":   " ",
                "infoPostFix":    "",
                "thousands":      ",",
                "lengthMenu":     "Show _MENU_ entries",
                "loadingRecords": "Loading...",
                "processing":     "Processing...",
                "search":         "Search:",
                "zeroRecords":    "검색 결과가 없습니다.",
                "paginate": {
                "first":      "First",
                "last":       "Last",
                "next":       "Next",
                "previous":   "Previous"
                },
                "aria": {
                "sortAscending":  ": activate to sort column ascending",
                "sortDescending": ": activate to sort column descending"
                },

                "lengthMenu": '<select class="form-control form-control-sm">'+
                  '<option value="10">10</option>'+
                  '<option value="20">20</option>'+
                  '<option value="30">30</option>'+
                  '<option value="40">40</option>'+
                  '<option value="50">50</option>'+
                  '<option value="-1">All</option>'+
                  '</select>'
         },
    });
}
