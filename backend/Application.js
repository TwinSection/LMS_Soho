const Koa = require("koa");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const AdminRoute = require("./Routes/AdminRoute");
const InstructorRoute = require("./Routes/InstructorRoute");
const APIRoute = require("./Routes/APIRoute");
const Database = require("./Database/Database")
const cors = require("@koa/cors");

module.exports = class Application{

    constructor(){
        this.app = new Koa();
        this.parser = new BodyParser();
        this.db = new Database();

        this.port = 9090;

        this.app.use(this.parser);
        this.app.use(cors());

        this.Router = new Router();

        this.AdminRouter = new Router({
            prefix: "/api/admin"
        });

        this.InstructorRouter = new Router({
            prefix: "/api/instructor"
        });

        this.APIRouter = new Router({
            prefix: "/api"
        });
    }

    Start(){
        this.db.Start();

        this.app.use((ctx, next) => {
            ctx.set("Access-Control-Allow-Origin", "*");
            ctx.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            ctx.db = this.db;
            return next();
        })

        this.Route();
        this.Listen();
    }

    Route(){
        this.APIRouter.use(APIRoute.UserMW);
        this.AdminRouter.use(AdminRoute.AdminMiddleWare);

        // Kullanıcı Yönetimi -admin-
        this.AdminRouter.get("/users", (ctx) => AdminRoute.GetUsers(ctx));
        this.AdminRouter.put("/users/:id", (ctx) => AdminRoute.ModifyUser(ctx));
        this.AdminRouter.post("/user", (ctx) => AdminRoute.CreateUser(ctx));
        this.AdminRouter.get("/user/:id", (ctx) => AdminRoute.GetUsers(ctx, ctx.params.id));
        this.AdminRouter.delete("/users/:id", (ctx) => AdminRoute.DeleteUser(ctx));
        // Kullanıcı Yönetimi -admin-

        // Eğitim Yönetimi -admin-
        this.AdminRouter.get("/courses", (ctx) => AdminRoute.GetCourses(ctx));
        this.AdminRouter.get("/courses/:id", (ctx) => AdminRoute.GetCourses(ctx, ctx.params.id));
        this.AdminRouter.post("/courses", (ctx) => AdminRoute.CreateCourse(ctx));
        this.AdminRouter.put("/courses/:id", (ctx) => AdminRoute.ModifyCourse(ctx));
        this.AdminRouter.delete("/courses/:id", (ctx) => AdminRoute.DeleteCourse(ctx));
        // Eğitim Yönetimi -admin-

        // Kategori Yönetimi -admin-
        this.AdminRouter.get("/categories", (ctx) => AdminRoute.GetCategory(ctx));
        this.AdminRouter.post("/categories", (ctx) => AdminRoute.CreateCategory(ctx));
        this.AdminRouter.put("/categories/:id", (ctx) => AdminRoute.ModifyCategory(ctx));
        this.AdminRouter.delete("/categories/:id", (ctx) => AdminRoute.DeleteCategory(ctx));
        // Katgori Yönetimi -admin-

        // Abonelik Yönetimi -admin-
        this.AdminRouter.get("/subscriptionplans", (ctx) => AdminRoute.GetSubscriptionPlans(ctx));
        this.AdminRouter.post("/subscriptionplans", (ctx) => AdminRoute.CreateSubscriptionPlan(ctx));
        this.AdminRouter.put("/subscriptionplans/:id", (ctx) => AdminRoute.ModifySubscriptionPlan(ctx));
        this.AdminRouter.delete("/subscriptionplans/:id", (ctx) => AdminRoute.DeleteSubscriptionPlan(ctx));
        // Abonelik Yönetimi -admin-

        // Dersler -admin-
        this.AdminRouter.get("/lessons", (ctx) => AdminRoute.GetLessons(ctx));
        this.AdminRouter.post("/lessons", (ctx) => AdminRoute.CreateLesson(ctx));
        this.AdminRouter.get("/lessons/:id", (ctx) => AdminRoute.GetLesson(ctx));
        this.AdminRouter.delete("/lessons/:id", (ctx) => AdminRoute.DeleteLesson(ctx));
        // Dersler -admin-

        // Bildirim Sistemi -admin-
        this.AdminRouter.get("/notifications", (ctx) => AdminRoute.GetNotifications(ctx));
        this.AdminRouter.post("/notifications", (ctx) => AdminRoute.CreateNotification(ctx));
        this.AdminRouter.put("/notifications:id", (ctx) => AdminRoute.ModifyNotification(ctx));
        this.AdminRouter.delete("/notifications:id", (ctx) => AdminRoute.DeleteNotification(ctx));
        // Bildirim Sistemi -admin-

        // Eğitim Güncelleme -Instructor-
        this.InstructorRouter.get("/courses", (ctx) => InstructorRoute.GetCourses(ctx));
        this.InstructorRouter.get("/courses/:id", (ctx) => InstructorRoute.GetCourses(ctx));
        this.InstructorRouter.put("/courses/:id", (ctx) => InstructorRoute.ModifyCourse(ctx));
        // Eğitim Güncelleme -Instructor-

        // Abonelik Sistemi
        this.APIRouter.get("/subscriptionplans", (ctx) => APIRoute.GetSubscriptionPlans(ctx));
        this.APIRouter.post("/subscription", (ctx) => APIRoute.SubToSubscriptionPlan(ctx));
        // Abonelik Sistemi

        // Bildirim Sistemi
        this.APIRouter.get("/notifications", (ctx) => APIRoute.GetNotifications(ctx));
        this.APIRouter.put("/notifications:id", (ctx) => APIRoute.ReadedNotifications(ctx));
        // Bildirim Sistemi
        
        // Eğitim Görüntüleme
        this.APIRouter.get("/courses", (ctx) => APIRoute.GetCourses(ctx));
        this.APIRouter.get("/courses/:id", (ctx) => APIRoute.GetCourse(ctx));
        this.APIRouter.put("/progress", (ctx) => APIRoute.ModifyProgress(ctx));
        this.APIRouter.get("/progress/:id", (ctx) => APIRoute.GetProgress(ctx));
        // Eğitim Görüntüleme
        
        // Kullanıcı
        this.APIRouter.post("/register", (ctx) => APIRoute.RegisterUser(ctx));
        this.APIRouter.post("/auth/profile", (ctx) => APIRoute.LoginUser(ctx));
        this.APIRouter.get("/auth/getprofile", (ctx) => APIRoute.GetUserInfo(ctx));
        this.APIRouter.put("/auth/profile", (ctx) => APIRoute.ModifyUser(ctx));
        // Kullanıcı
        
        this.Router.get("/home", (ctx) => {})
        this.Router.get("/", (ctx) => {})
    }

    Listen(){
        this.app.use(this.Router.routes()).use(this.Router.allowedMethods());
        this.app.use(this.APIRouter.routes()).use(this.APIRouter.allowedMethods());
        this.app.use(this.AdminRouter.routes()).use(this.AdminRouter.allowedMethods());
        this.app.use(this.InstructorRouter.routes()).use(this.InstructorRouter.allowedMethods());

        this.app.listen(this.port);

        console.log("Server has started. http://localhost:%s", this.port);
    }
}