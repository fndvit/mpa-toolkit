FROM public.ecr.aws/lambda/nodejs:16

RUN yum update -y

COPY scripts/pgdg.repo /etc/yum.repos.d/pgdg.repo

RUN yum makecache
RUN yum install -y postgresql13

COPY dist/ /asset/

WORKDIR /asset/
CMD [ "migration-runner.handler" ]
