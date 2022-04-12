<template>
	<div>
		<div class="card shadow mb-4">
			<div class="card-header py-3">
				<div class="row">
					<div class="col-md-10">
						<h6 class="m-0 font-weight-bold text-primary">
							Users (No data because there is no API endpoint)
						</h6>
					</div>
					
					<div class="col-md-2">
						<button type="button" class="float-right btn btn-success btn-circle btn-sm" data-toggle="modal" data-target="#add-user">
							<i class="fas fa-plus"></i>
						</button>
					</div>
				</div>
			</div>

			<div class="card-body">
				<div class="table-responsive">
					<table class="table table-bordered dataTable" id="data-sets-table" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;">
						<thead>
							<tr role="row">
								<th>#</th>
								<th>Username</th>
								<th>Email</th>
								<th>Status</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							<tr role="row" class="user" v-for="user in users" v-bind:key="user.id" :id="user.id">
								<td>{{ user.nr }}</td>
								<td>{{ user.userName }}</td>
								<td>{{ user.email }}</td>
								<td>{{ user.status }}</td>
								<td>
									<a href="#" @click="deleteUser">
										<i class="d-flex justify-content-center fas fa-trash"></i>
									</a>
								</td>

							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div class="modal fade new-data-set-form" id="add-user">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title">New user</h4>

							<button type="button" class="close" @click="clearCreateWindow" data-dismiss="modal">&times;</button>
						</div>
						
						<div class="modal-body">
							<form>
								<div class="form-group">
									<label for="new-user-username" class="col-form-label">Username</label>
									<input type="text" class="form-control" id="new-user-username">
								</div>

								<div class="form-group">
									<label for="new-user-email" class="col-form-label">Email</label>
									<input type="email" class="form-control" id="new-user-email">
								</div>

								<div class="form-group">
									<label for="new-user-password1" class="col-form-label">Password1</label>
									<input type="password" class="form-control" id="new-user-password1">
								</div>

								<div class="form-group">
									<label for="new-user-password2" class="col-form-label">Password2</label>
									<input type="password" class="form-control" id="new-user-password2">
								</div>
								
<!-- 								<div class="form-group">
									<label for="new-user-status" class="col-form-label">Status</label>
									<input type="number" class="form-control" id="new-user-status">
								</div> -->
							</form>
						</div>

						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" @click="clearCreateWindow" data-dismiss="modal">Cancel</button>

							<button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="createUser">OK</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<script src="./AdminPanel.js"></script>