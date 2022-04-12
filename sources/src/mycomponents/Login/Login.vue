<template>
	<div>
		<div class="container">

			<!-- Outer Row -->
			<div class="row justify-content-center">

				<div class="col-xl-6 col-lg-6 col-md-6">

					<div class="card o-hidden border-0 shadow-lg my-5">
						<div class="card-body p-0">
						<!-- Nested Row within Card Body -->
							<div class="row">
								<!-- <div class="col-lg-6 d-none d-lg-block bg-login-image"></div> -->

								<!--<div class="col-lg-3 d-none d-lg-block">
									<img src="@/assets/logo.png" style="max-width:100%;" />
								</div>-->

								<div class="col-lg-12">
									<div class="row text-center">
										<img src="@/assets/logo.png" class="mx-auto d-block" style="max-width:100%;width:45%" />
									</div>
									<div class="py-1 px-5">
										<form class="user">
											<div class="form-group">
												<input type="email" class="form-control form-control-user" id="email" aria-describedby="emailHelp" placeholder="Enter Username...">
											</div>
											
											<div class="form-group">
												<input type="password" class="form-control form-control-user" id="password" placeholder="Password">
											</div>

											<div class="btn btn-primary btn-user btn-block" v-on:click="login" >
												<span>Login</span>
											</div>
										</form>
										<hr>
										<div class="text-center">
											<span class="small">Demo user: demo, demo password: BalticDemo</span>
										</div>
										<hr>
										<div class="d-lg-block">
											<img src="@/assets/IBSR_logo_EUflag_500px_cropped.jpg" style="max-width:100%;" />
										</div>
										<!--<div class="text-center">
											<router-link :to="{name: 'Register'}">
												<span>Register</span>
											</router-link>
										</div>
										-->
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>

<script src="./Login.js"></script>