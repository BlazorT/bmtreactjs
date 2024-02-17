using Microsoft.EntityFrameworkCore.Migrations;

namespace Blazor.Web.Infrastructure.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateSequence(
                name: "BlazorAutoIdentity",
                incrementBy: 1);

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CategoryName = table.Column<string>(maxLength: 100, nullable: false),
                    Description = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Product",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    ProductName = table.Column<string>(maxLength: 100, nullable: false),
                    QuantityPerUnit = table.Column<string>(nullable: true),
                    UnitPrice = table.Column<decimal>(nullable: true),
                    UnitsInStock = table.Column<short>(nullable: true),
                    UnitsOnOrder = table.Column<short>(nullable: true),
                    ReorderLevel = table.Column<short>(nullable: true),
                    Discontinued = table.Column<bool>(nullable: false),
                    CategoryId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Product_Category_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
            name: "Price",
            columns: table => new
            {
                id = table.Column<int>(nullable: false),
                detail = table.Column<string>(maxLength: 100, nullable: false),               
                unitprice = table.Column<decimal>(nullable: true),
                modifieddate = table.Column<System.DateTime>(nullable: true),
                createddate = table.Column<System.DateTime>(nullable: true),
                createdby = table.Column<int>(nullable: true),
                modifiedby = table.Column<int>(nullable: true),
                categoryid = table.Column<int>(nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Price", x => x.id);
                table.ForeignKey(
                    name: "FK_Price_Category_CategoryId",
                    column: x => x.categoryid,
                    principalTable: "Category",
                     principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
            });
            migrationBuilder.CreateIndex(
                name: "IX_Price_CategoryId",
                table: "Price",
                column: "categoryid");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Product");
            migrationBuilder.DropTable(
               name: "Price");
            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropSequence(
                name: "BlazorAutoIdentity");
        }
    }
}
