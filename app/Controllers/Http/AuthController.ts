import User from "App/Models/User";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AuthController {
  public async register({ request }: HttpContextContract) {
    /**
     * Validate user details
     */
    const validationSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: "users", column: "email" }),
      ]),
      password: schema.string({ trim: true }, [rules.confirmed()]),
    });
    const userDetails = await request.validate({
      schema: validationSchema,
    });
    /**
     * Create a new user
     */
    const user = new User();
    user.email = userDetails.email;
    user.password = userDetails.password;
    await user.save();
    await auth.login(user);
    response.redirect("/dashboard");
  }

  public async login({ session, request, response, auth }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");
    console.log(email, password);
    try {
      await auth.attempt(email, password);
      response.redirect("/dashboard");
    } catch {
      session.flash('errors', "Itsn't possible to logon using the credentials informed")
      response.redirect("/login");
    }
  }
}
