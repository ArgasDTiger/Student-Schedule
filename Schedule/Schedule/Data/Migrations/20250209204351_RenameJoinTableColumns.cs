using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Schedule.Data.Migrations
{
    /// <inheritdoc />
    public partial class RenameJoinTableColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FacultyUser_Faculties_FacultiesId",
                table: "FacultyUser");

            migrationBuilder.DropForeignKey(
                name: "FK_FacultyUser_Users_UserId",
                table: "FacultyUser");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupUser_Groups_GroupsId",
                table: "GroupUser");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupUser_Users_UserId",
                table: "GroupUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupUser",
                table: "GroupUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FacultyUser",
                table: "FacultyUser");

            migrationBuilder.RenameTable(
                name: "GroupUser",
                newName: "GroupUsers");

            migrationBuilder.RenameTable(
                name: "FacultyUser",
                newName: "FacultyUsers");

            migrationBuilder.RenameColumn(
                name: "GroupsId",
                table: "GroupUsers",
                newName: "GroupId");

            migrationBuilder.RenameIndex(
                name: "IX_GroupUser_UserId",
                table: "GroupUsers",
                newName: "IX_GroupUsers_UserId");

            migrationBuilder.RenameColumn(
                name: "FacultiesId",
                table: "FacultyUsers",
                newName: "FacultyId");

            migrationBuilder.RenameIndex(
                name: "IX_FacultyUser_UserId",
                table: "FacultyUsers",
                newName: "IX_FacultyUsers_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupUsers",
                table: "GroupUsers",
                columns: new[] { "GroupId", "UserId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_FacultyUsers",
                table: "FacultyUsers",
                columns: new[] { "FacultyId", "UserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_FacultyUsers_Faculties_FacultyId",
                table: "FacultyUsers",
                column: "FacultyId",
                principalTable: "Faculties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FacultyUsers_Users_UserId",
                table: "FacultyUsers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupUsers_Groups_GroupId",
                table: "GroupUsers",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupUsers_Users_UserId",
                table: "GroupUsers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FacultyUsers_Faculties_FacultyId",
                table: "FacultyUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_FacultyUsers_Users_UserId",
                table: "FacultyUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupUsers_Groups_GroupId",
                table: "GroupUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupUsers_Users_UserId",
                table: "GroupUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupUsers",
                table: "GroupUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FacultyUsers",
                table: "FacultyUsers");

            migrationBuilder.RenameTable(
                name: "GroupUsers",
                newName: "GroupUser");

            migrationBuilder.RenameTable(
                name: "FacultyUsers",
                newName: "FacultyUser");

            migrationBuilder.RenameColumn(
                name: "GroupId",
                table: "GroupUser",
                newName: "GroupsId");

            migrationBuilder.RenameIndex(
                name: "IX_GroupUsers_UserId",
                table: "GroupUser",
                newName: "IX_GroupUser_UserId");

            migrationBuilder.RenameColumn(
                name: "FacultyId",
                table: "FacultyUser",
                newName: "FacultiesId");

            migrationBuilder.RenameIndex(
                name: "IX_FacultyUsers_UserId",
                table: "FacultyUser",
                newName: "IX_FacultyUser_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupUser",
                table: "GroupUser",
                columns: new[] { "GroupsId", "UserId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_FacultyUser",
                table: "FacultyUser",
                columns: new[] { "FacultiesId", "UserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_FacultyUser_Faculties_FacultiesId",
                table: "FacultyUser",
                column: "FacultiesId",
                principalTable: "Faculties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FacultyUser_Users_UserId",
                table: "FacultyUser",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupUser_Groups_GroupsId",
                table: "GroupUser",
                column: "GroupsId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupUser_Users_UserId",
                table: "GroupUser",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
