if (!injectScript) {
  var injectScript = () => {
    let keywordTableSelector =
      'table:has(th:contains("Buyers searched for")):has(th:contains("Clicks Rate"))';

    main();

    async function main() {
      const res = await retryFunctionWithDelay(waitForTable, 10, 2000);
      if (res) {
        replaceTh();
        makeTableSortable();
      }
    }

    async function waitForTable() {
      const table = $(keywordTableSelector);
      if (table.length == 0) {
        return false;
      } else {
        return true;
      }
    }
    function replaceTh() {
      $(keywordTableSelector).addClass("keyword-table");
      $(keywordTableSelector + " tbody th").removeClass();
      $(keywordTableSelector + " tbody td").removeClass();

      $(`<table class="injected-table"><thead> </thead></table>`).insertBefore(
        keywordTableSelector
      );

      const headerTextArray = [
        "Buyers searched for",
        "Views",
        "Clicks",
        "",
        "Click Rate",
        "Spend",
        "Orders",
        "",
        "POAS",
        "Relevant",
      ];
      const tableHead = $(".injected-table thead");
      const newRow = $("<tr class='injected-tr'>");

      // Loop through the header text array and create <th> elements
      headerTextArray.forEach(function (text) {
        const newHeader = $(
          "<th class='wt-table__head__cell wt-no-wrap'>"
        ).html(text + '<span class="injected-icon"></span> ');
        newRow.append(newHeader);
      });

      tableHead.append(newRow);
      console.log("thead moi add vao", $(".injected-table"));
      $(".injected-table:not(:last)").remove();
    }

    function makeTableSortable() {
      $(".injected-table thead th").click(function () {
        if ([0, 3, 7, 9].includes($(this).index())) {
          return;
        }

        const thIndex = $(this).index();

        $(".injected-table thead th").each(function (index) {
          // Check if the index is different from 4
          if (index !== thIndex) {
            // Set the HTML content of the current TH element to empty
            $(this).find(".injected-icon").html("");
          }
        });

        var rows = $(keywordTableSelector)
          .find("tr:gt(0)")
          .toArray()
          .sort(comparer($(this).index()));

        this.asc = !this.asc;
        if (!this.asc) {
          rows = rows.reverse();
          $(this).find(".injected-icon").text("⬇");
        } else {
          $(this).find(".injected-icon").text("⬆");
        }
        $(keywordTableSelector).find("tbody").empty();
        for (var i = 0; i < rows.length; i++) {
          $(keywordTableSelector).append(rows[i]);
        }
      });

      function comparer(index) {
        // column index
        return function (a, b) {
          var valA = getCellValue(a, index);
          var valB = getCellValue(b, index);

          return valA - valB;
        };
      }

      function getCellValue(row, index) {
        const val = $($(row).children()[index])
          .text()
          .match(/[+-]?\d+(\.\d+)?/);

        return parseFloat(val);
      }
    }

    async function retryFunctionWithDelay(childFunction, count, delay) {
      let attempts = 0;
      let res;
      while (true) {
        res = await childFunction();
        // console.log(attempts, res, childFunction);
        if (res !== false || attempts > count) break;
        attempts++;

        await sleep(delay);
      }

      return res;
    }

    async function sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }
  };
}

injectScript && injectScript();
