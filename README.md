# Containers From the Couch 🛋

This is the sample repository used for the demos for the [Containers from the Couch episode](https://www.youtube.com/watch?v=Pc3sG6dUl5o).


> DevOps is the combination of cultural, engineering practices and patterns, and tools that increase an organization's ability to deliver applications and services at high velocity and better quality. 
> [https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/introduction.html](https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/introduction.html)

I will walk through some of our newer features in the context of accelerating your DevOps journey. We’re interested in how on the latest functionality around both speeding the delivery of apps but also delivering them with better quality.

What are the several DevOps practices that Copilot helps you with:
- Infrastructure as Code
- Continuous Delivery of your microservices
- Monitoring and Logging
- Security

### Infrastructure as code
> A practice in which infrastructure is provisioned and managed using code.
We have been supporting IaC since v0. 
For example, when you want to create a microservice with Copilot you type `copilot svc init` and the output is a manifest file that can be stored and reviewed in a git repository. This is the IaC file that models your service.

Over the past few months, we have working hard on bringing more power to the manifest files:
- LBWS manifest with `secrets`  (v1.15), `alias`for HTTPS endpoints,  `env_file` (v1.14), `autoscaling` cooldown (v1.20).
- You can run `copilot svc show --manifest test` (v1.20) so that you can compare what’s different between what’s running in prod and your local file.
- Backend Services with Internal ALB support (v1.19) same spec as LBWS, configuring individual subnets `from_tags`(v1.21)
- You can `copilot svc exec` to `frontend` and run `curl -k https://amazon.com`
- Schedule Job with `option: none` (v1.17) and `copilot job run` (v1.20) makes it super easy to run one of containers with IaC. By the way `job run` was an external contribution! [#3692].
- FIFO Worker Services and SNS Topics (v1.22)In all of our releases, we give credit to anyone that has contributed outside of core team.

One of our most exciting releases was v1.20 that introduced IaC for environments!
You can think of an environment as a deployment stage like ‘test’, ‘prod’, and it contains configuration that gets shared between services.
copilot env init
- Updating the certificates of your public load balancer (v1.20)
- CloudFront support (v1.21) with restricted ingress and TLS termination (v1.22).

I hope this showed the breath of the different types of applications you can build while maintaining a clean, consistent, readable interface to model AWS services.

### Continuous Delivery
>  Continuous delivery is a software development practice where code changes are automatically prepared for a release to production.
> Continuous delivery expands upon continuous integration by deploying all code changes to a testing environment and/or a production environment after the build stage. 
> And you want to implement various level of testing before releasing.

Ok so we have seen that Copilot can create deployment stages as well as services. Next to create pipeline that wires everything up you can issue the following command:
```
$ copilot pipeline init
```

- Creating a pipeline for environments
- Controlling order of deployments (v1.18) {demo} You can change the order of the deployments for your services so that you can control deploying your api before your frontend service for example.
- Pipeline build role (v1.20)
- Custom build spec path (v1.16)

### Monitoring and Logging
-  Container Insights toggling in the environment manifest (v1.20).
- Enabling access logs for ELBs (v1.21).
- {demo} The `logs` command is consistent across services and jobs.  You can follow logs `--follow`, you can get logs in the last few minutes `--since`.You can now do `copilot job logs -p` (v1.22) to view the logs of the last stopped task to troubleshot. You can filter on individual containers (v1.22)
- `copilot svc status` to view the health of the services.

### Security
- Copilot automatically handles IAM and security groups for you with least privileged permissions.
- We try to provide options in the manifest files for Security Hub best practices ([https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html])
- Permissions Boundary support so that you can limit the power of Copilot such that you can block from certain actions happening. Let’s say you really don’t like our friends over at DynamoDB for example (I love this service btw it’s fantastic), and you don’t want to allow anybody from using DynamoDB.

```
copilot app init --permissions-boundary SampleServiceControlPolicy
copilot storage init # choose DynamoDB
copilot deploy # should fail.
```
